pipeline {
    agent any
    
    environment {
        // 1. Assignation DIRECTE pour éviter les alertes de sécurité (interpolation)
        // Jenkins gère automatiquement le mapping des credentials vers les variables TF_VAR
        TF_VAR_proxmox_secret    = credentials('PROXMOX_SECRET')
        TF_VAR_cloudflare_token  = credentials('CLOUDFLARE_TOKEN')
        TF_VAR_cloudflare_acc_id = credentials('CF_ACCOUNT_ID')
        
        // 2. Variable Ansible
        ANSIBLE_HOST_KEY_CHECKING = "False"
    }

    stages {
        // ÉTAPE MANQUANTE : Récupérer le dépôt Git pour avoir les fichiers .tf
        stage('📥 Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('🏗️ Provisioning (OpenTofu)') {
            steps {
                dir('infra-auto') {
                    // On s'assure que le dossier existe avant de lancer Tofu
                    sh 'ls -la'
                    sh 'tofu init'
                    sh 'tofu apply -auto-approve'
                }
            }
        }

        stage('⚙️ Configuration (Ansible)') {
            steps {
                script {
                    echo "🔍 Recherche de l'IP DHCP réelle sur l'hôte Proxmox..."
                    sleep 15 

                    // Utilisation de guillemets simples pour le script shell afin d'éviter l'interpolation Groovy
                    env.LXC_IP = sh(
                        script: '''
                            ssh -o StrictHostKeyChecking=no \
                                -o UserKnownHostsFile=/dev/null \
                                root@192.168.1.88 \
                                'pct exec 300 -- hostname -I | cut -d" " -f1'
                        ''',
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
                
                dir('frontend-app') {
                    git branch: 'master', url: 'https://github.com/LBouzac/PortFolio.git'

                    echo "📦 Compilation de l'application Angular..."
                    sh 'npm install'
                    sh 'npm run build -- --configuration production'

                    echo "🚚 Transfert des fichiers vers le conteneur..."
                    // Utilisation de l'IP dynamique récupérée plus haut
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
            echo "🔗 Accès : https://trantors.cc"
            echo "-----------------------------------------------------------"
        }
        failure {
            echo "❌ Échec du pipeline."
        }
    }
}
