# aws-group-video
IaC for the Video application.

The boostrap-application-group.yml is executed by https://github.com/WPMedia/aws-bootstrap.

The boostrap-application-group.yml creates a few pipelines that execute the IaC templates in the 'cloudformation' director.

When any commit is pushed to the master branch the pipelines will be triggered and the cloudformation stacks will be updated with the latest changes.