/* eslint-disable quotes */
import { Duration } from 'aws-cdk-lib';
import {
  Instance,
  ISecurityGroup,
  MachineImage,
  MultipartBody,
  MultipartUserData,
  Port,
  SubnetType,
  UserData,
  IVpc,
  SubnetSelection,
  InstanceType,
  ApplyCloudFormationInitOptions,
  CloudFormationInit,
  BlockDevice,
} from 'aws-cdk-lib/aws-ec2';
import { Effect, PolicyStatement, IRole } from 'aws-cdk-lib/aws-iam';
import { IDatabaseProxy } from 'aws-cdk-lib/aws-rds';
import { Construct } from 'constructs';

/**
 * Properties of an EC2 Instance without machine image
 */
export interface BastionInstanceProps {
  /**
   * Name of SSH keypair to grant access to instance
   *
   * @default - No SSH access will be possible.
   */
  readonly keyName?: string;
  /**
   * Where to place the instance within the VPC
   *
   * @default - Private subnets.
   */
  readonly vpcSubnets?: SubnetSelection;
  /**
   * In which AZ to place the instance within the VPC
   *
   * @default - Random zone.
   */
  readonly availabilityZone?: string;
  /**
   * Whether the instance could initiate connections to anywhere by default.
   * This property is only used when you do not provide a security group.
   *
   * @default true
   */
  readonly allowAllOutbound?: boolean;
  /**
   * The length of time to wait for the resourceSignalCount
   *
   * The maximum value is 43200 (12 hours).
   *
   * @default Duration.minutes(5)
   */
  readonly resourceSignalTimeout?: Duration;
  /**
   * VPC to launch the instance in.
   */
  readonly vpc: IVpc;
  /**
   * Security Group to assign to this instance
   *
   * @default - create new security group
   */
  readonly securityGroup?: ISecurityGroup;
  /**
   * Type of instance to launch
   */
  readonly instanceType: InstanceType;
  /**
   * Specific UserData to use
   *
   * The UserData may still be mutated after creation.
   *
   * @default - A UserData object appropriate for the MachineImage's
   * Operating System is created.
   */
  readonly userData?: UserData;
  /**
   * Changes to the UserData force replacement
   *
   * Depending the EC2 instance type, changing UserData either
   * restarts the instance or replaces the instance.
   *
   * - Instance store-backed instances are replaced.
   * - EBS-backed instances are restarted.
   *
   * By default, restarting does not execute the new UserData so you
   * will need a different mechanism to ensure the instance is restarted.
   *
   * Setting this to `true` will make the instance's Logical ID depend on the
   * UserData, which will cause CloudFormation to replace it if the UserData
   * changes.
   *
   * @default - true iff `initOptions` is specified, false otherwise.
   */
  readonly userDataCausesReplacement?: boolean;
  /**
   * An IAM role to associate with the instance profile assigned to this Auto Scaling Group.
   *
   * The role must be assumable by the service principal `ec2.amazonaws.com`:
   *
   * @example
   * const role = new iam.Role(this, 'MyRole', {
   *   assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com')
   * });
   *
   * @default - A role will automatically be created, it can be accessed via the `role` property
   */
  readonly role?: IRole;
  /**
   * The name of the instance
   *
   * @default - CDK generated name
   */
  readonly instanceName?: string;
  /**
   * Specifies whether to enable an instance launched in a VPC to perform NAT.
   * This controls whether source/destination checking is enabled on the instance.
   * A value of true means that checking is enabled, and false means that checking is disabled.
   * The value must be false for the instance to perform NAT.
   *
   * @default true
   */
  readonly sourceDestCheck?: boolean;
  /**
   * Specifies how block devices are exposed to the instance. You can specify virtual devices and EBS volumes.
   *
   * Each instance that is launched has an associated root device volume,
   * either an Amazon EBS volume or an instance store volume.
   * You can use block device mappings to specify additional EBS volumes or
   * instance store volumes to attach to an instance when it is launched.
   *
   * @see https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/block-device-mapping-concepts.html
   *
   * @default - Uses the block device mapping of the AMI
   */
  readonly blockDevices?: BlockDevice[];
  /**
   * Defines a private IP address to associate with an instance.
   *
   * Private IP should be available within the VPC that the instance is build within.
   *
   * @default - no association
   */
  readonly privateIpAddress?: string;
  /**
   * Propagate the EC2 instance tags to the EBS volumes.
   *
   * @default - false
   */
  readonly propagateTagsToVolumeOnCreation?: boolean;
  /**
   * Apply the given CloudFormation Init configuration to the instance at startup
   *
   * @default - no CloudFormation init
   */
  readonly init?: CloudFormationInit;
  /**
   * Use the given options for applying CloudFormation Init
   *
   * Describes the configsets to use and the timeout to wait
   *
   * @default - default options
   */
  readonly initOptions?: ApplyCloudFormationInitOptions;
  /**
   * Whether IMDSv2 should be required on this instance.
   *
   * @default - false
   */
  readonly requireImdsv2?: boolean;
  /**
   * Whether "Detailed Monitoring" is enabled for this instance
   * Keep in mind that Detailed Monitoring results in extra charges
   *
   * @see http://aws.amazon.com/cloudwatch/pricing/
   * @default - false
   */
  readonly detailedMonitoring?: boolean;
  /**
   * Add SSM session permissions to the instance role
   *
   * Setting this to `true` adds the necessary permissions to connect
   * to the instance using SSM Session Manager. You can do this
   * from the AWS Console.
   *
   * NOTE: Setting this flag to `true` may not be enough by itself.
   * You must also use an AMI that comes with the SSM Agent, or install
   * the SSM Agent yourself. See
   * [Working with SSM Agent](https://docs.aws.amazon.com/systems-manager/latest/userguide/ssm-agent.html)
   * in the SSM Developer Guide.
   *
   * @default false
   */
  readonly ssmSessionPermissions?: boolean;
  /**
   * Whether to associate a public IP address to the primary network interface attached to this instance.
   *
   * @default - public IP address is automatically assigned based on default behavior
   */
  readonly associatePublicIpAddress?: boolean;
}


export interface BastionProps extends BastionInstanceProps {
  readonly database: string;
  readonly username: string;
  readonly proxy: IDatabaseProxy;
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
      `echo export DBUSER=${props.username} >> /etc/profile`,
      `echo export DBNAME=${props.database} >> /etc/profile`,
      // db connect with iam credentials
      `curl -JL www.amazontrust.com/repository/AmazonRootCA1.pem -o /home/ec2-user/AmazonRootCA1.pem`,
      `touch /home/ec2-user/auth-token`,
      `chown -R ec2-user /home/ec2-user/auth-token`,
      `chmod +x /home/ec2-user/auth-token`,
      `echo 'PGSSLMODE=verify-full' >> /home/ec2-user/auth-token`,
      `echo 'PGSSLROOTCERT=/home/ec2-user/AmazonRootCA1.pem' >> /home/ec2-user/auth-token`,
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
