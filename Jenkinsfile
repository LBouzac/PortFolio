pipeline {
    agent any
    
    environment {
        // 1. Récupération des secrets Jenkins
        PM_SECRET  = credentials('PROXMOX_SECRET')
        CF_TOKEN   = credentials('CLOUDFLARE_TOKEN')
        CF_ACC_ID  = credentials('CF_ACCOUNT_ID')
        
        // 2. Mapping pour OpenTofu (TF_VAR_...)
        TF_VAR_proxmox_secret    = "${env.PM_SECRET}"
        TF_VAR_cloudflare_token  = "${env.CF_TOKEN}"
        TF_VAR_cloudflare_acc_id = "${env.CF_ACC_ID}"
        
        // 3. Désactiver la vérification des clés SSH pour Ansible
        ANSIBLE_HOST_KEY_CHECKING = "False"
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
                    sleep 20 

                    env.LXC_IP = sh(
                        script: """
                            ssh -o StrictHostKeyChecking=no \
                                -o UserKnownHostsFile=/dev/null \
                                root@192.168.1.88 \
                                'pct exec 300 -- hostname -I | cut -d" " -f1'
                        """,
                        returnStdout: true
                    ).trim()

                    echo "✅ IP Réelle trouvée : ${env.LXC_IP}"

                    // 1. On récupère le bon TOKEN généré par OpenTofu
                    dir('infra-auto') {
                        env.TUNNEL_TOKEN = sh(script: 'tofu output -raw tunnel_token', returnStdout: true).trim()
                    }

                    // 2. On lance Ansible avec ce Token spécifique
                    sh """
                        ANSIBLE_HOST_KEY_CHECKING=False \
                        ansible-playbook -i ${env.LXC_IP}, setup-site.yml \
                        --extra-vars "tunnel_token=${env.TUNNEL_TOKEN}"
                    """
                }
            }
        }

        stage('🚀 Build & Deploy Angular') {
            steps {
                echo "📦 Compilation de l'application Angular..."
                sh 'npm install'
                sh 'npm run build -- --configuration production'

                echo "🚚 Transfert des fichiers vers le conteneur..."
                // Transfert via SCP vers le dossier Nginx du conteneur
                sh """
                    scp -o StrictHostKeyChecking=no \
                        -o UserKnownHostsFile=/dev/null \
                        -r dist/*/browser/* root@${env.LXC_IP}:/var/www/html/
                """
            }
        }
    }
    
    post {
        success {
            echo "-----------------------------------------------------------"
            echo "✅ DÉPLOIEMENT RÉUSSI !"
            echo "🌐 IP du serveur : ${env.LXC_IP}"
            echo "🔗 Accès : https://portfolio.trantor.cc"
            echo "-----------------------------------------------------------"
        }
        failure {
            echo "❌ Échec du pipeline."
        }
    }
}
