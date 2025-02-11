pipeline {
    agent any

    triggers {
        githubPush()
    }

    environment {
        WORKSPACE_DIR = '/neuralit/Entrustv2/entrust2Frontend'
        IMAGE_NAME = 'react-nginx-app'
        CONTAINER_NAME = 'react-nginx-app-main'
        HOST_PORT = '3000'
        CONTAINER_PORT = '3000'
        NODE_PATH = '/var/lib/jenkins/.nvm/versions/node/v22.13.0/bin'
        VITE_BASE_URL = 'http://10.10.0.89'
        VITE_BASE_PORT = '8000'
        VITE_BASE_FRONTEND_URL = 'http://10.10.0.89:3000'
        VITE_RECAPTCHA_KEY = '6Lc8rkYqAAAAALLGmMUYKn0tFrrOcGhGqZWZIjoJ'
        VITE_STRIPE_SECRET_KEY = 'sk_test_V00g1w39I9d9z2zC1Q8RThln'
        VITE_CLIENT_SPECIFIC_ROLES = '[7]'
        VITE_SECRET_KEY = 'FOPS_SYNCENTRUST'
    }

    stages {
        stage('Git Pull') {
            steps {
                echo 'Pulling latest code...'
                dir(WORKSPACE_DIR) {
                    script {
                        sh "sudo git config --global --add safe.directory ${WORKSPACE_DIR}"
                        checkout([
                            $class: 'GitSCM',
                            branches: [[name: '*/main']],
                            doGenerateSubmoduleConfigurations: false,
                            extensions: [[$class: 'LocalBranch', localBranch: 'main']],
                            userRemoteConfigs: [[
                                url: 'https://github.com/gitneural/entrust2Frontend.git',
                                credentialsId: 'github-pat-freestyle'
                            ]]
                        ])
                    }
                }
            }
        }

        stage('Build Frontend') {
            steps {
                script {
                    withEnv(["PATH+NODE=${NODE_PATH}"]) {
                        dir(WORKSPACE_DIR) {
                            sh """
                                sudo chown -R jenkins:jenkins .
                                sudo rm -rf dist
                            """
                            echo 'Installing and building frontend dependencies...'
                            sh "node -v"
                            sh "npm -v"
                            sh """
                                echo "--------- Jenkins Environment Vars ---------"
                                echo "VITE_BASE_URL=\$VITE_BASE_URL"
                                echo "VITE_BASE_PORT=\$VITE_BASE_PORT"
                                echo "VITE_BASE_FRONTEND_URL=\$VITE_BASE_FRONTEND_URL"
                                echo "VITE_RECAPTCHA_KEY=\$VITE_RECAPTCHA_KEY"
                                echo "VITE_STRIPE_SECRET_KEY=\$VITE_STRIPE_SECRET_KEY"
                                echo "VITE_CLIENT_SPECIFIC_ROLES=\$VITE_CLIENT_SPECIFIC_ROLES"
                                echo "VITE_SECRET_KEY=\$VITE_SECRET_KEY"
                                echo "-------------------------------------------"
                            """
                            sh """
                                npm install
                                npm run build
                            """
                        }
                    }
                }
            }
        }

        stage('List Running Containers') {
            steps {
                echo 'Listing running Docker containers...'
                sh 'sudo docker ps'
            }
        }

        stage('Stop and Remove Old Container') {
            steps {
                script {
                    def containerId = sh(
                        script: "sudo docker ps -q --filter name=${CONTAINER_NAME}",
                        returnStdout: true
                    ).trim()
                    if (containerId) {
                        echo "Stopping container: ${containerId}"
                        sh "sudo docker stop ${containerId}"
                        sh "sudo docker rm ${containerId}"
                    } else {
                        echo "No running container found with name: ${CONTAINER_NAME}"
                    }
                }
            }
        }

        stage('Rebuild Docker Image') {
            steps {
                echo 'Rebuilding Docker image...'
                dir(WORKSPACE_DIR) {
                    sh "sudo docker build -t ${IMAGE_NAME} ."
                }
            }
        }

        stage('Run New Container') {
            steps {
                echo 'Running new Docker container...'
                sh """
                    sudo docker run -d -p ${HOST_PORT}:${CONTAINER_PORT} \\
                        --name ${CONTAINER_NAME} \\
                        ${IMAGE_NAME}
                """
            }
        }

        stage('Verify Deployment') {
            steps {
                echo 'Verifying the running container...'
                sh 'sudo docker ps'
            }
        }
    }

    post {
        always {
            echo 'Pipeline execution completed.'
        }
        success {
            echo 'Deployment succeeded!'
        }
        failure {
            echo 'Deployment failed. Check logs for details.'
        }
    }
}
