/* eslint-disable quotes */
import {
  Instance,
  InstanceProps,
  ISecurityGroup,
  MachineImage,
  MultipartBody,
  MultipartUserData,
  Port,
  SubnetType,
  UserData,
} from 'aws-cdk-lib/aws-ec2';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { IDatabaseProxy } from 'aws-cdk-lib/aws-rds';
import { ISecret } from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';

export interface BastionProps extends Omit<InstanceProps, 'machineImage'> {
  readonly database: string;
  readonly username: string;
  readonly proxy: IDatabaseProxy;
  readonly secret: ISecret;
  readonly proxySecurityGroup: ISecurityGroup;
}

export class Bastion extends Instance {
  constructor(scope: Construct, id: string, props: BastionProps) {
    // Commands to run on boot
    const multipartUserData = new MultipartUserData();
    const userData = UserData.forLinux();
    multipartUserData.addUserDataPart(userData, MultipartBody.SHELL_SCRIPT, true);

    userData.addCommands(
      // QoL updates
      `yum update -y`,
      `yum install jq -y`,
      `yum install postgresql15 -y`,
      `yum purge --auto-remove nano`,
      `echo export EDITOR=vim >> /etc/profile`,
      // bash profile
      `TOKEN=$(curl --request PUT "http://169.254.169.254/latest/api/token" --header "X-aws-ec2-metadata-token-ttl-seconds: 3600")`,
      `echo export AWSREGION=$(curl -s http://169.254.169.254/latest/meta-data/placement/region --header "X-aws-ec2-metadata-token: $TOKEN") >> /etc/profile`,
      `echo export PRXNAME=${props.proxy.dbProxyName} >> /etc/profile`,
      `echo export PRXENDP=${props.proxy.endpoint} >> /etc/profile`,
      `echo export SECRETARN=${props.secret.secretFullArn!} >> /etc/profile`,
      `echo export DBNAME=${props.database} >> /etc/profile`,
      // db credentials setup file to source
      // we don't want to run this, just generate the file to be run by the user
      `touch /home/ec2-user/setup`,
      `chown -R ec2-user /home/ec2-user/setup`,
      `chmod +x /home/ec2-user/setup`,
      `echo 'CREDS=$(aws secretsmanager get-secret-value --region $AWSREGION --secret-id $SECRETARN | jq -r '.SecretString')' >> /home/ec2-user/setup`,
      `echo 'DBUSER=$(echo $CREDS | jq -r '.username')' >> /home/ec2-user/setup`,
      `echo 'PGPASSWORD=$(echo $CREDS | jq -r '.password')' >> /home/ec2-user/setup`,
      // db connect with iam credentials
      `curl -JL www.amazontrust.com/repository/AmazonRootCA1.pem -o /home/ec2-user/AmazonRootCA1.pem`,
      `touch /home/ec2-user/auth-token`,
      `chown -R ec2-user /home/ec2-user/auth-token`,
      `chmod +x /home/ec2-user/auth-token`,
      `echo 'PGSSLMODE=verify-full' >> /home/ec2-user/auth-token`,
      `echo 'PGSSLROOTCERT=/home/ec2-user/AmazonRootCA1.pem' >> /home/ec2-user/auth-token`,
      `echo 'CREDS=$(aws secretsmanager get-secret-value --region $AWSREGION --secret-id $SECRETARN | jq -r '.SecretString')' >> /home/ec2-user/auth-token`,
      `echo 'DBUSER=$(echo $CREDS | jq -r '.username')' >> /home/ec2-user/auth-token`,
      `echo 'PGPASSWORD=$(aws rds generate-db-auth-token --hostname $PRXENDP --port 5432 --region $AWSREGION --username $DBUSER)' >> /home/ec2-user/auth-token`,
      // connect helper
      `touch /home/ec2-user/connect`,
      `chown -R ec2-user /home/ec2-user/connect`,
      `chmod +x /home/ec2-user/connect`,
      `echo 'psql -h $PRXENDP -U $DBUSER -d $DBNAME -W' >> /home/ec2-user/connect`,
    );

    super(scope, id, {
      ...props,
      vpc: props.vpc,
      vpcSubnets: props.vpc ? props.vpc.selectSubnets({
        subnetType: SubnetType.PUBLIC,
      }) : undefined,
      userData,
      machineImage: MachineImage.latestAmazonLinux2023(),
    });

    if (props.userData) this.addUserData(props.userData.render());

    this.addSecurityGroup(props.proxySecurityGroup);

    // allow ssh from anywhere (requires sshkey)
    if (!props.keyName) throw new Error('keyName needs to be provided for ssh');
    this.connections.allowFromAnyIpv4(Port.tcp(22));

    // reference database managed secret and grant read to lambda function
    props.secret.grantRead(this.role);

    // reference database proxy and grant connect to lambda function
    // allow bastion (this) to connect as user
    props.proxy.grantConnect(this.role, props.username);

    this.role.addToPrincipalPolicy(new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ['secretsmanager:ListSecrets'],
      resources: ['*'],
    }));

    this.role.addToPrincipalPolicy(new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ['rds:DescribeDBProxies'],
      resources: [props.proxy.dbProxyArn],
    }));
  }
}
