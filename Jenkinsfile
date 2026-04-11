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
                    
                    // On attend que le conteneur démarre et demande son IP
                    sleep 20 

                    // On interroge le Proxmox (192.168.1.88) pour trouver l'IP du conteneur 300
                    env.LXC_IP = sh(
                        script: """
                            ssh -o StrictHostKeyChecking=no \
                                -o UserKnownHostsFile=/dev/null \
                                root@192.168.1.88 \
                                'pct exec 300 -- ip -4 addr show eth0 | grep inet | awk "{print \$2}" | cut -d/ -f1'
                        """,
                        returnStdout: true
                    ).trim()

                    if (!env.LXC_IP || env.LXC_IP == "" || env.LXC_IP == "dhcp") {
                        error "❌ Impossible de déterminer l'IP réelle du conteneur. Vérifie le réseau Proxmox."
                    }

                    echo "✅ IP Réelle trouvée : ${env.LXC_IP}"

                    // Exécution d'Ansible avec le token Cloudflare sécurisé
                    // On utilise \$CF_TOKEN pour que le secret ne soit pas logué en clair par Jenkins
                    sh """
                        ansible-playbook -i ${env.LXC_IP}, setup-site.yml \
                        --extra-vars "tunnel_token=\$CF_TOKEN"
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
            echo "💡 Conseil : Vérifie que 'setup-site.yml' utilise 'service:' et non 'rc_service:'"
        }
    }
}
