pipeline {
    agent any
    
    environment {
        // 1. Secrets Jenkins
        PM_SECRET  = credentials('PROXMOX_SECRET')
        CF_TOKEN   = credentials('CLOUDFLARE_TOKEN')
        CF_ACC_ID  = credentials('CF_ACCOUNT_ID')
        
        // 2. Variables Tofu
        TF_VAR_proxmox_secret    = "${env.PM_SECRET}"
        TF_VAR_cloudflare_token  = "${env.CF_TOKEN}"
        TF_VAR_cloudflare_acc_id = "${env.CF_ACC_ID}"
        
        // 3. Variable Ansible
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
                // Le bloc script est OBLIGATOIRE ici pour gérer les variables
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

                    dir('infra-auto') {
                        env.TUNNEL_TOKEN = sh(script: 'tofu output -raw tunnel_token', returnStdout: true).trim()
                    }

                    sh """
                        ansible-playbook -i ${env.LXC_IP}, setup-site.yml \
                        --extra-vars "tunnel_token=${env.TUNNEL_TOKEN}"
                    """
                }
            }
        }

        stage('🚀 Build & Deploy Angular') {
            steps {
                echo "📥 Téléchargement du code source Angular..."
                
                // 1. On crée un dossier temporaire pour le frontend
                dir('frontend-app') {
                    
                    git branch: 'master', url: 'https://github.com/LBouzac/PortFolio.git'

                    echo "📦 Compilation de l'application Angular..."
                    sh 'npm install'
                    sh 'npm run build -- --configuration production'

                    echo "🚚 Transfert des fichiers vers le conteneur..."
                    sh """
                        scp -o StrictHostKeyChecking=no \
                            -o UserKnownHostsFile=/dev/null \
                            -r dist/*/browser/* root@${env.LXC_IP}:/var/www/html/
                    """
                }
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
