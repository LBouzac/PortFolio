pipeline {
    agent any

    environment {
        // On récupère les secrets configurés dans Jenkins
        PM_SECRET = credentials('PROXMOX_SECRET')
        CF_TOKEN  = credentials('CLOUDFLARE_TOKEN')
        CF_ACC_ID = credentials('CF_ACCOUNT_ID')
        TF_VAR_proxmox_secret = "${env.PM_SECRET}"
        TF_VAR_cloudflare_token = "${env.CF_TOKEN}"
    }

    stages {
        stage('🏗️ Provisioning (OpenTofu)') {
            steps {
                dir('infra-auto') {
                    sh 'tofu init'
                    // On crée le LXC et le tunnel chez Cloudflare
                    sh 'tofu apply -auto-approve'
                    // On récupère l'IP du nouveau conteneur pour Ansible
                    script {
                        env.LXC_IP = sh(script: "tofu output -raw lxc_ip", returnStdout: true).trim()
                        env.TUNNEL_TOKEN = sh(script: "tofu output -raw tunnel_token", returnStdout: true).trim()
                    }
                }
            }
        }

        stage('⚙️ Configuration (Ansible)') {
            steps {
                // On attend que le LXC ait fini de démarrer
                sleep 10
                // On lance Ansible pour installer Nginx et Cloudflared
                sh """
                ansible-playbook -i ${env.LXC_IP}, setup-site.yml \
                --extra-vars "tunnel_token=${env.TUNNEL_TOKEN}"
                """
            }
        }

        stage('🚀 Build & Deploy Angular') {
            steps {
                sh 'npm install'
                sh 'npm run build -- --configuration production'
                // Transfert des fichiers sur le nouveau serveur
                sh "scp -r dist/port-folio-app/browser/* root@${env.LXC_IP}:/var/www/html/"
            }
        }
    }

    post {
        success {
            echo "✅ Succès ! Ton site est en ligne sur https://portfolio.trantor.cc"
        }
    }
}
