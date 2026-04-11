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
                // TOUT ce qui contient de la logique (variables) doit être dans ce bloc script
                script {
                    echo "🔍 Recherche de l'IP DHCP réelle sur l'hôte Proxmox..."
                    sleep 15 

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

                    // Le dir() est BIEN À L'INTÉRIEUR du script {}
                    dir('infra-auto') {
                        env.TUNNEL_TOKEN = sh(script: 'tofu output -raw tunnel_token', returnStdout: true).trim()
                    }

                    // On lance Ansible
                    sh """
                        ANSIBLE_HOST_KEY_CHECKING=False \
                        ansible-playbook -i ${env.LXC_IP}, setup-site.yml \
                        --extra-vars "tunnel_token=${env.TUNNEL_TOKEN}"
                    """
                } // <-- Fin du bloc script
            } // <-- Fin du bloc steps
        } // <-- Fin de l'étape

       stage('🚀 Build & Deploy Angular') {
            steps {
                echo "✅ IP Réelle trouvée : ${env.LXC_IP}"

                    dir('infra-auto') {
                        env.TUNNEL_TOKEN = sh(script: 'tofu output -raw tunnel_token', returnStdout: true).trim()
                    }

                    echo "⏳ Laisse le temps au service SSH de s'allumer..."
                    sleep 15 
                    // ----------------------------------

                    sh """
                        ANSIBLE_HOST_KEY_CHECKING=False \
                        ansible-playbook -i ${env.LXC_IP}, setup-site.yml \
                        --extra-vars "tunnel_token=${env.TUNNEL_TOKEN}"
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
