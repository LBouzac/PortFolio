pipeline {
    agent any
    
    environment {
        PM_SECRET  = credentials('PROXMOX_SECRET')
        CF_TOKEN   = credentials('CLOUDFLARE_TOKEN')
        CF_ACC_ID  = credentials('CF_ACCOUNT_ID')
        
        TF_VAR_proxmox_secret    = "${env.PM_SECRET}"
        TF_VAR_cloudflare_token  = "${env.CF_TOKEN}"
        TF_VAR_cloudflare_acc_id = "${env.CF_ACC_ID}"
        
        ANSIBLE_HOST_KEY_CHECKING = "False"   // ✅ Fix SSH host key
    }

    stages {
        stage('🏗️ Provisioning (OpenTofu)') {
            steps {
                dir('infra-auto') {
                    sh 'tofu init'
                    sh 'tofu apply -auto-approve'
                }
            }
        }

        stage('⚙️ Configuration (Ansible)') {
            steps {
                script {
                    echo "🔍 Recherche de l'IP DHCP réelle sur l'hôte Proxmox..."
                    sleep 20  // Légèrement augmenté pour bail DHCP fiable

                    env.LXC_IP = sh(
                        script: """
                            ssh -o StrictHostKeyChecking=no \
                                -o UserKnownHostsFile=/dev/null \
                                root@192.168.1.88 \
                                'pct exec 300 -- ip -4 addr show eth0 | grep inet | awk "{print \$2}" | cut -d/ -f1'
                        """,
                        returnStdout: true
                    ).trim()

                    if (!env.LXC_IP || env.LXC_IP == "dhcp") {
                        error "❌ Impossible de déterminer l'IP réelle du conteneur."
                    }

                    echo "✅ IP Réelle trouvée : ${env.LXC_IP}"

                    // ✅ Fix SSH + variable token correctement isolée
                    withCredentials([string(credentialsId: 'CLOUDFLARE_TOKEN', variable: 'CF_SECRET')]) {
                        sh """
                            ANSIBLE_HOST_KEY_CHECKING=False \
                            ansible-playbook \
                                -i ${env.LXC_IP}, \
                                setup-site.yml \
                                --extra-vars "tunnel_token=\${CF_SECRET}"
                        """
                    }
                }
            }
        }

        stage('🚀 Build & Deploy Angular') {
            steps {
                sh 'npm install'
                sh 'npm run build -- --configuration production'

                sh """
                    scp -o StrictHostKeyChecking=no \
                        -o UserKnownHostsFile=/dev/null \
                        -r dist/*/browser/* \
                        root@${env.LXC_IP}:/var/www/html/
                """
            }
        }
    }

    post {
        success {
            echo "-----------------------------------------------------------"
            echo "✅ DÉPLOIEMENT RÉUSSI SUR ${env.LXC_IP} !"
            echo "🌐 Ton site est en ligne : https://portfolio.trantor.cc"
            echo "-----------------------------------------------------------"
        }
        failure {
            echo "❌ Échec du pipeline. Consulte les logs ci-dessus."
            echo "💡 Causes fréquentes : SSH, Ansible, OpenTofu, ou build Angular."
        }
    }
}
