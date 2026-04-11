pipeline {
    agent any
    
    environment {
        // 1. Secrets Jenkins
        PM_SECRET      = credentials('PROXMOX_SECRET')
        CF_TOKEN       = credentials('CLOUDFLARE_TOKEN')
        CF_ACC_ID      = credentials('CF_ACCOUNT_ID')
        
        // 2. Mapping OpenTofu
        TF_VAR_proxmox_secret    = "${env.PM_SECRET}"
        TF_VAR_cloudflare_token  = "${env.CF_TOKEN}"
        TF_VAR_cloudflare_acc_id = "${env.CF_ACC_ID}"
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
                    sleep 15 // Temps pour le bail DHCP
                    
                    // On récupère l'IP réelle et on l'écrase dans env.LXC_IP
                    // On utilise des simples quotes pour le script pour ne pas interférer avec Groovy
                    env.LXC_IP = sh(
                        script: "ssh -o StrictHostKeyChecking=no root@192.168.1.88 'pct exec 300 -- ip -4 addr show eth0 | grep inet | awk \"{print \\\$2}\" | cut -d/ -f1'",
                        returnStdout: true
                    ).trim()

                    if (env.LXC_IP == "" || env.LXC_IP == "dhcp") {
                        error "❌ Impossible de déterminer l'IP réelle du conteneur."
                    }

                    echo "✅ IP Réelle trouvée : ${env.LXC_IP}"

                    // Correction Sécurité : On utilise \$CF_TOKEN pour que le Shell gère le secret
                    sh "ansible-playbook -i ${env.LXC_IP}, setup-site.yml --extra-vars tunnel_token=\$CF_TOKEN"
                }
            }
        }

        stage('🚀 Build & Deploy Angular') {
            steps {
                // Compilation
                sh 'npm install'
                sh 'npm run build -- --configuration production'
                
                // Déploiement : env.LXC_IP contient maintenant la vraie IP (ex: 192.168.1.133)
                // On ajoute -o StrictHostKeyChecking=no pour éviter les blocages SSH
                sh "scp -v -o StrictHostKeyChecking=no -r dist/*/browser/* root@${env.LXC_IP}:/var/www/html/"
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
            echo "❌ Échec du build. Vérifie le fichier setup-site.yml (doit utiliser 'service:' et non 'rc_service:')"
        }
    }
}
