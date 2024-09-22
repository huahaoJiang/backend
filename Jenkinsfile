pipeline {
  agent {
    node {
      label 'base'
    }
  }
  environment {
    KUBECONFIG_CREDENTIAL_ID = 'demo-kubeconfig'
    GITHUB_ACCOUNT = 'huahaoJ'
    HARBOR_NAMESPACE = 'ks-devops-nest'
    APP_NAME = 'nest-example-1'
    REGISTRY = '10.233.19.27'
    HARBOR_CREDENTIAL = credentials('harbor-test')
  }

  stages {
    stage('build and push image') {
    agent none
      steps {
        container('base') {
          sh '''echo $HARBOR_CREDENTIAL_PSW | docker login $REGISTRY -u $HARBOR_CREDENTIAL_USR --password-stdin
            docker build --build-arg env="test" -f Dockerfile -t $REGISTRY/$HARBOR_NAMESPACE/$APP_NAME:SNAPSHOT-$BRANCH_NAME-$BUILD_NUMBER .
            docker push $REGISTRY/$HARBOR_NAMESPACE/$APP_NAME:SNAPSHOT-$BRANCH_NAME-$BUILD_NUMBER
            echo image: $REGISTRY/$HARBOR_NAMESPACE/$APP_NAME:SNAPSHOT-$BRANCH_NAME-$BUILD_NUMBER
          '''
        }

      }
    }
  }

  parameters {
    string(name: 'TAG_NAME', defaultValue: '', description: '')
  }
}
