pipeline {
    agent any

    stages {
        stage('1. Récupération du Code') {
            steps {
                // Jenkins récupère automatiquement le code lié à ce job
                checkout scm
            }
        }

        stage('2. Installation & Compilation') {
            steps {
                // On installe les paquets et on build l'app Angular
                sh 'npm install'
                sh 'npm run build -- --configuration production'
            }
        }

        stage('3. Déploiement Local') {
            steps {
                // On copie les fichiers directement via le réseau local Proxmox
                // ATTENTION : Vérifie le chemin "dist/port-folio-app/browser/*" selon ta version d'Angular
                sh 'scp -r dist/port-folio-app/browser/* root@192.168.1.18:/var/www/html/'
            }
        }

        stage('4. Redémarrage Nginx') {
            steps {
                // On envoie un ordre de redémarrage au serveur web
                sh 'ssh root@192.168.1.18 "rc-service nginx restart"'
            }
        }
    }
}
