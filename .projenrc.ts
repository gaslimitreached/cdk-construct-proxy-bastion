import { awscdk } from 'projen';

const project = new awscdk.AwsCdkConstructLibrary({
  author: 'cachemonet',
  authorAddress: 'noneya@business.com',
  cdkVersion: '2.86.0',
  defaultReleaseBranch: 'main',
  jsiiVersion: '~5.0.0',
  name: 'cdk-construct-proxy-bastion',
  projenrcTs: true,
  repositoryUrl: 'https://github.com/gaslimitreached/cdk-construct-proxy-bastion.git',
  releaseToNpm: true,
});

project.synth();
