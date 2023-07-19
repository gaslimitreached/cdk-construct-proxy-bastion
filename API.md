# CDK Construct AWS RDS Proxy Bastion

Simple wrapper around `aws-cdk-lib` `ec2.Instance` that configures an RDS
proxy. See the UserData for setup scripts.
resources.

**Warning**: Using the bastion exposes the secrets to the ssh user and you should consider alternatives before using.

```typescript
import { Construct } from 'constructs';

import { Bastion } from 'cdk-construct-proxy-bastion';

class MyStack extends cdk.Stack {

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Database, secret, and proxy setup...

    new Bastion(this, 'JumpBox', {
      vpc,
      proxy,
      proxySecurityGroup,
      secret,
      database: 'test',
      username: 'testuser',
      keyName: 'myKey',
    });
  }
}
```

Once deployed ssh to the box and run the scripts:

`source ./setup` - source database username and pg password from secret
`./connect`      - connect to proxy using psql

## `iamAuth`

When creating the RDS Proxy it's possible to require AWS Identity and Access Management (IAM) authentication for connections to the proxy.

If your proxy has been configured this way than the postgres password needs to be requested with the cli; `aws rds generate-db-auth-token`

It also requires that you have the Amazon Rootr CA for request signing.

These concerns are covered in the `auth-token` script and the usage looks similar to the above.

`source ./setup`
`source ./auth-token`
`./connect`

# API Reference <a name="API Reference" id="api-reference"></a>

## Constructs <a name="Constructs" id="Constructs"></a>

### Bastion <a name="Bastion" id="cdk-construct-proxy-bastion.Bastion"></a>

#### Initializers <a name="Initializers" id="cdk-construct-proxy-bastion.Bastion.Initializer"></a>

```typescript
import { Bastion } from 'cdk-construct-proxy-bastion'

new Bastion(scope: Construct, id: string, props: BastionProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-construct-proxy-bastion.Bastion.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#cdk-construct-proxy-bastion.Bastion.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-construct-proxy-bastion.Bastion.Initializer.parameter.props">props</a></code> | <code><a href="#cdk-construct-proxy-bastion.BastionProps">BastionProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="cdk-construct-proxy-bastion.Bastion.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="cdk-construct-proxy-bastion.Bastion.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="cdk-construct-proxy-bastion.Bastion.Initializer.parameter.props"></a>

- *Type:* <a href="#cdk-construct-proxy-bastion.BastionProps">BastionProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-construct-proxy-bastion.Bastion.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#cdk-construct-proxy-bastion.Bastion.applyRemovalPolicy">applyRemovalPolicy</a></code> | Apply the given removal policy to this resource. |
| <code><a href="#cdk-construct-proxy-bastion.Bastion.addSecurityGroup">addSecurityGroup</a></code> | Add the security group to the instance. |
| <code><a href="#cdk-construct-proxy-bastion.Bastion.addToRolePolicy">addToRolePolicy</a></code> | Adds a statement to the IAM role assumed by the instance. |
| <code><a href="#cdk-construct-proxy-bastion.Bastion.addUserData">addUserData</a></code> | Add command to the startup script of the instance. |

---

##### `toString` <a name="toString" id="cdk-construct-proxy-bastion.Bastion.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `applyRemovalPolicy` <a name="applyRemovalPolicy" id="cdk-construct-proxy-bastion.Bastion.applyRemovalPolicy"></a>

```typescript
public applyRemovalPolicy(policy: RemovalPolicy): void
```

Apply the given removal policy to this resource.

The Removal Policy controls what happens to this resource when it stops
being managed by CloudFormation, either because you've removed it from the
CDK application or because you've made a change that requires the resource
to be replaced.

The resource can be deleted (`RemovalPolicy.DESTROY`), or left in your AWS
account for data recovery and cleanup later (`RemovalPolicy.RETAIN`).

###### `policy`<sup>Required</sup> <a name="policy" id="cdk-construct-proxy-bastion.Bastion.applyRemovalPolicy.parameter.policy"></a>

- *Type:* aws-cdk-lib.RemovalPolicy

---

##### `addSecurityGroup` <a name="addSecurityGroup" id="cdk-construct-proxy-bastion.Bastion.addSecurityGroup"></a>

```typescript
public addSecurityGroup(securityGroup: ISecurityGroup): void
```

Add the security group to the instance.

###### `securityGroup`<sup>Required</sup> <a name="securityGroup" id="cdk-construct-proxy-bastion.Bastion.addSecurityGroup.parameter.securityGroup"></a>

- *Type:* aws-cdk-lib.aws_ec2.ISecurityGroup

: The security group to add.

---

##### `addToRolePolicy` <a name="addToRolePolicy" id="cdk-construct-proxy-bastion.Bastion.addToRolePolicy"></a>

```typescript
public addToRolePolicy(statement: PolicyStatement): void
```

Adds a statement to the IAM role assumed by the instance.

###### `statement`<sup>Required</sup> <a name="statement" id="cdk-construct-proxy-bastion.Bastion.addToRolePolicy.parameter.statement"></a>

- *Type:* aws-cdk-lib.aws_iam.PolicyStatement

---

##### `addUserData` <a name="addUserData" id="cdk-construct-proxy-bastion.Bastion.addUserData"></a>

```typescript
public addUserData(commands: string): void
```

Add command to the startup script of the instance.

The command must be in the scripting language supported by the instance's OS (i.e. Linux/Windows).

###### `commands`<sup>Required</sup> <a name="commands" id="cdk-construct-proxy-bastion.Bastion.addUserData.parameter.commands"></a>

- *Type:* string

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-construct-proxy-bastion.Bastion.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |
| <code><a href="#cdk-construct-proxy-bastion.Bastion.isOwnedResource">isOwnedResource</a></code> | Returns true if the construct was created by CDK, and false otherwise. |
| <code><a href="#cdk-construct-proxy-bastion.Bastion.isResource">isResource</a></code> | Check whether the given construct is a Resource. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="cdk-construct-proxy-bastion.Bastion.isConstruct"></a>

```typescript
import { Bastion } from 'cdk-construct-proxy-bastion'

Bastion.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="cdk-construct-proxy-bastion.Bastion.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

##### `isOwnedResource` <a name="isOwnedResource" id="cdk-construct-proxy-bastion.Bastion.isOwnedResource"></a>

```typescript
import { Bastion } from 'cdk-construct-proxy-bastion'

Bastion.isOwnedResource(construct: IConstruct)
```

Returns true if the construct was created by CDK, and false otherwise.

###### `construct`<sup>Required</sup> <a name="construct" id="cdk-construct-proxy-bastion.Bastion.isOwnedResource.parameter.construct"></a>

- *Type:* constructs.IConstruct

---

##### `isResource` <a name="isResource" id="cdk-construct-proxy-bastion.Bastion.isResource"></a>

```typescript
import { Bastion } from 'cdk-construct-proxy-bastion'

Bastion.isResource(construct: IConstruct)
```

Check whether the given construct is a Resource.

###### `construct`<sup>Required</sup> <a name="construct" id="cdk-construct-proxy-bastion.Bastion.isResource.parameter.construct"></a>

- *Type:* constructs.IConstruct

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-construct-proxy-bastion.Bastion.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#cdk-construct-proxy-bastion.Bastion.property.env">env</a></code> | <code>aws-cdk-lib.ResourceEnvironment</code> | The environment this resource belongs to. |
| <code><a href="#cdk-construct-proxy-bastion.Bastion.property.stack">stack</a></code> | <code>aws-cdk-lib.Stack</code> | The stack in which this resource is defined. |
| <code><a href="#cdk-construct-proxy-bastion.Bastion.property.connections">connections</a></code> | <code>aws-cdk-lib.aws_ec2.Connections</code> | Allows specify security group connections for the instance. |
| <code><a href="#cdk-construct-proxy-bastion.Bastion.property.grantPrincipal">grantPrincipal</a></code> | <code>aws-cdk-lib.aws_iam.IPrincipal</code> | The principal to grant permissions to. |
| <code><a href="#cdk-construct-proxy-bastion.Bastion.property.instance">instance</a></code> | <code>aws-cdk-lib.aws_ec2.CfnInstance</code> | the underlying instance resource. |
| <code><a href="#cdk-construct-proxy-bastion.Bastion.property.instanceAvailabilityZone">instanceAvailabilityZone</a></code> | <code>string</code> | The availability zone the instance was launched in. |
| <code><a href="#cdk-construct-proxy-bastion.Bastion.property.instanceId">instanceId</a></code> | <code>string</code> | The instance's ID. |
| <code><a href="#cdk-construct-proxy-bastion.Bastion.property.instancePrivateDnsName">instancePrivateDnsName</a></code> | <code>string</code> | Private DNS name for this instance. |
| <code><a href="#cdk-construct-proxy-bastion.Bastion.property.instancePrivateIp">instancePrivateIp</a></code> | <code>string</code> | Private IP for this instance. |
| <code><a href="#cdk-construct-proxy-bastion.Bastion.property.instancePublicDnsName">instancePublicDnsName</a></code> | <code>string</code> | Publicly-routable DNS name for this instance. |
| <code><a href="#cdk-construct-proxy-bastion.Bastion.property.instancePublicIp">instancePublicIp</a></code> | <code>string</code> | Publicly-routable IP  address for this instance. |
| <code><a href="#cdk-construct-proxy-bastion.Bastion.property.osType">osType</a></code> | <code>aws-cdk-lib.aws_ec2.OperatingSystemType</code> | The type of OS the instance is running. |
| <code><a href="#cdk-construct-proxy-bastion.Bastion.property.role">role</a></code> | <code>aws-cdk-lib.aws_iam.IRole</code> | The IAM role assumed by the instance. |
| <code><a href="#cdk-construct-proxy-bastion.Bastion.property.userData">userData</a></code> | <code>aws-cdk-lib.aws_ec2.UserData</code> | UserData for the instance. |

---

##### `node`<sup>Required</sup> <a name="node" id="cdk-construct-proxy-bastion.Bastion.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `env`<sup>Required</sup> <a name="env" id="cdk-construct-proxy-bastion.Bastion.property.env"></a>

```typescript
public readonly env: ResourceEnvironment;
```

- *Type:* aws-cdk-lib.ResourceEnvironment

The environment this resource belongs to.

For resources that are created and managed by the CDK
(generally, those created by creating new class instances like Role, Bucket, etc.),
this is always the same as the environment of the stack they belong to;
however, for imported resources
(those obtained from static methods like fromRoleArn, fromBucketName, etc.),
that might be different than the stack they were imported into.

---

##### `stack`<sup>Required</sup> <a name="stack" id="cdk-construct-proxy-bastion.Bastion.property.stack"></a>

```typescript
public readonly stack: Stack;
```

- *Type:* aws-cdk-lib.Stack

The stack in which this resource is defined.

---

##### `connections`<sup>Required</sup> <a name="connections" id="cdk-construct-proxy-bastion.Bastion.property.connections"></a>

```typescript
public readonly connections: Connections;
```

- *Type:* aws-cdk-lib.aws_ec2.Connections

Allows specify security group connections for the instance.

---

##### `grantPrincipal`<sup>Required</sup> <a name="grantPrincipal" id="cdk-construct-proxy-bastion.Bastion.property.grantPrincipal"></a>

```typescript
public readonly grantPrincipal: IPrincipal;
```

- *Type:* aws-cdk-lib.aws_iam.IPrincipal

The principal to grant permissions to.

---

##### `instance`<sup>Required</sup> <a name="instance" id="cdk-construct-proxy-bastion.Bastion.property.instance"></a>

```typescript
public readonly instance: CfnInstance;
```

- *Type:* aws-cdk-lib.aws_ec2.CfnInstance

the underlying instance resource.

---

##### `instanceAvailabilityZone`<sup>Required</sup> <a name="instanceAvailabilityZone" id="cdk-construct-proxy-bastion.Bastion.property.instanceAvailabilityZone"></a>

```typescript
public readonly instanceAvailabilityZone: string;
```

- *Type:* string

The availability zone the instance was launched in.

---

##### `instanceId`<sup>Required</sup> <a name="instanceId" id="cdk-construct-proxy-bastion.Bastion.property.instanceId"></a>

```typescript
public readonly instanceId: string;
```

- *Type:* string

The instance's ID.

---

##### `instancePrivateDnsName`<sup>Required</sup> <a name="instancePrivateDnsName" id="cdk-construct-proxy-bastion.Bastion.property.instancePrivateDnsName"></a>

```typescript
public readonly instancePrivateDnsName: string;
```

- *Type:* string

Private DNS name for this instance.

---

##### `instancePrivateIp`<sup>Required</sup> <a name="instancePrivateIp" id="cdk-construct-proxy-bastion.Bastion.property.instancePrivateIp"></a>

```typescript
public readonly instancePrivateIp: string;
```

- *Type:* string

Private IP for this instance.

---

##### `instancePublicDnsName`<sup>Required</sup> <a name="instancePublicDnsName" id="cdk-construct-proxy-bastion.Bastion.property.instancePublicDnsName"></a>

```typescript
public readonly instancePublicDnsName: string;
```

- *Type:* string

Publicly-routable DNS name for this instance.

(May be an empty string if the instance does not have a public name).

---

##### `instancePublicIp`<sup>Required</sup> <a name="instancePublicIp" id="cdk-construct-proxy-bastion.Bastion.property.instancePublicIp"></a>

```typescript
public readonly instancePublicIp: string;
```

- *Type:* string

Publicly-routable IP  address for this instance.

(May be an empty string if the instance does not have a public IP).

---

##### `osType`<sup>Required</sup> <a name="osType" id="cdk-construct-proxy-bastion.Bastion.property.osType"></a>

```typescript
public readonly osType: OperatingSystemType;
```

- *Type:* aws-cdk-lib.aws_ec2.OperatingSystemType

The type of OS the instance is running.

---

##### `role`<sup>Required</sup> <a name="role" id="cdk-construct-proxy-bastion.Bastion.property.role"></a>

```typescript
public readonly role: IRole;
```

- *Type:* aws-cdk-lib.aws_iam.IRole

The IAM role assumed by the instance.

---

##### `userData`<sup>Required</sup> <a name="userData" id="cdk-construct-proxy-bastion.Bastion.property.userData"></a>

```typescript
public readonly userData: UserData;
```

- *Type:* aws-cdk-lib.aws_ec2.UserData

UserData for the instance.

---


## Structs <a name="Structs" id="Structs"></a>

### BastionInstanceProps <a name="BastionInstanceProps" id="cdk-construct-proxy-bastion.BastionInstanceProps"></a>

Properties of an EC2 Instance without machine image.

#### Initializer <a name="Initializer" id="cdk-construct-proxy-bastion.BastionInstanceProps.Initializer"></a>

```typescript
import { BastionInstanceProps } from 'cdk-construct-proxy-bastion'

const bastionInstanceProps: BastionInstanceProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-construct-proxy-bastion.BastionInstanceProps.property.instanceType">instanceType</a></code> | <code>aws-cdk-lib.aws_ec2.InstanceType</code> | Type of instance to launch. |
| <code><a href="#cdk-construct-proxy-bastion.BastionInstanceProps.property.vpc">vpc</a></code> | <code>aws-cdk-lib.aws_ec2.IVpc</code> | VPC to launch the instance in. |
| <code><a href="#cdk-construct-proxy-bastion.BastionInstanceProps.property.allowAllOutbound">allowAllOutbound</a></code> | <code>boolean</code> | Whether the instance could initiate connections to anywhere by default. |
| <code><a href="#cdk-construct-proxy-bastion.BastionInstanceProps.property.associatePublicIpAddress">associatePublicIpAddress</a></code> | <code>boolean</code> | Whether to associate a public IP address to the primary network interface attached to this instance. |
| <code><a href="#cdk-construct-proxy-bastion.BastionInstanceProps.property.availabilityZone">availabilityZone</a></code> | <code>string</code> | In which AZ to place the instance within the VPC. |
| <code><a href="#cdk-construct-proxy-bastion.BastionInstanceProps.property.blockDevices">blockDevices</a></code> | <code>aws-cdk-lib.aws_ec2.BlockDevice[]</code> | Specifies how block devices are exposed to the instance. You can specify virtual devices and EBS volumes. |
| <code><a href="#cdk-construct-proxy-bastion.BastionInstanceProps.property.detailedMonitoring">detailedMonitoring</a></code> | <code>boolean</code> | Whether "Detailed Monitoring" is enabled for this instance Keep in mind that Detailed Monitoring results in extra charges. |
| <code><a href="#cdk-construct-proxy-bastion.BastionInstanceProps.property.init">init</a></code> | <code>aws-cdk-lib.aws_ec2.CloudFormationInit</code> | Apply the given CloudFormation Init configuration to the instance at startup. |
| <code><a href="#cdk-construct-proxy-bastion.BastionInstanceProps.property.initOptions">initOptions</a></code> | <code>aws-cdk-lib.aws_ec2.ApplyCloudFormationInitOptions</code> | Use the given options for applying CloudFormation Init. |
| <code><a href="#cdk-construct-proxy-bastion.BastionInstanceProps.property.instanceName">instanceName</a></code> | <code>string</code> | The name of the instance. |
| <code><a href="#cdk-construct-proxy-bastion.BastionInstanceProps.property.keyName">keyName</a></code> | <code>string</code> | Name of SSH keypair to grant access to instance. |
| <code><a href="#cdk-construct-proxy-bastion.BastionInstanceProps.property.privateIpAddress">privateIpAddress</a></code> | <code>string</code> | Defines a private IP address to associate with an instance. |
| <code><a href="#cdk-construct-proxy-bastion.BastionInstanceProps.property.propagateTagsToVolumeOnCreation">propagateTagsToVolumeOnCreation</a></code> | <code>boolean</code> | Propagate the EC2 instance tags to the EBS volumes. |
| <code><a href="#cdk-construct-proxy-bastion.BastionInstanceProps.property.requireImdsv2">requireImdsv2</a></code> | <code>boolean</code> | Whether IMDSv2 should be required on this instance. |
| <code><a href="#cdk-construct-proxy-bastion.BastionInstanceProps.property.resourceSignalTimeout">resourceSignalTimeout</a></code> | <code>aws-cdk-lib.Duration</code> | The length of time to wait for the resourceSignalCount. |
| <code><a href="#cdk-construct-proxy-bastion.BastionInstanceProps.property.role">role</a></code> | <code>aws-cdk-lib.aws_iam.IRole</code> | An IAM role to associate with the instance profile assigned to this Auto Scaling Group. |
| <code><a href="#cdk-construct-proxy-bastion.BastionInstanceProps.property.securityGroup">securityGroup</a></code> | <code>aws-cdk-lib.aws_ec2.ISecurityGroup</code> | Security Group to assign to this instance. |
| <code><a href="#cdk-construct-proxy-bastion.BastionInstanceProps.property.sourceDestCheck">sourceDestCheck</a></code> | <code>boolean</code> | Specifies whether to enable an instance launched in a VPC to perform NAT. |
| <code><a href="#cdk-construct-proxy-bastion.BastionInstanceProps.property.ssmSessionPermissions">ssmSessionPermissions</a></code> | <code>boolean</code> | Add SSM session permissions to the instance role. |
| <code><a href="#cdk-construct-proxy-bastion.BastionInstanceProps.property.userData">userData</a></code> | <code>aws-cdk-lib.aws_ec2.UserData</code> | Specific UserData to use. |
| <code><a href="#cdk-construct-proxy-bastion.BastionInstanceProps.property.userDataCausesReplacement">userDataCausesReplacement</a></code> | <code>boolean</code> | Changes to the UserData force replacement. |
| <code><a href="#cdk-construct-proxy-bastion.BastionInstanceProps.property.vpcSubnets">vpcSubnets</a></code> | <code>aws-cdk-lib.aws_ec2.SubnetSelection</code> | Where to place the instance within the VPC. |

---

##### `instanceType`<sup>Required</sup> <a name="instanceType" id="cdk-construct-proxy-bastion.BastionInstanceProps.property.instanceType"></a>

```typescript
public readonly instanceType: InstanceType;
```

- *Type:* aws-cdk-lib.aws_ec2.InstanceType

Type of instance to launch.

---

##### `vpc`<sup>Required</sup> <a name="vpc" id="cdk-construct-proxy-bastion.BastionInstanceProps.property.vpc"></a>

```typescript
public readonly vpc: IVpc;
```

- *Type:* aws-cdk-lib.aws_ec2.IVpc

VPC to launch the instance in.

---

##### `allowAllOutbound`<sup>Optional</sup> <a name="allowAllOutbound" id="cdk-construct-proxy-bastion.BastionInstanceProps.property.allowAllOutbound"></a>

```typescript
public readonly allowAllOutbound: boolean;
```

- *Type:* boolean
- *Default:* true

Whether the instance could initiate connections to anywhere by default.

This property is only used when you do not provide a security group.

---

##### `associatePublicIpAddress`<sup>Optional</sup> <a name="associatePublicIpAddress" id="cdk-construct-proxy-bastion.BastionInstanceProps.property.associatePublicIpAddress"></a>

```typescript
public readonly associatePublicIpAddress: boolean;
```

- *Type:* boolean
- *Default:* public IP address is automatically assigned based on default behavior

Whether to associate a public IP address to the primary network interface attached to this instance.

---

##### `availabilityZone`<sup>Optional</sup> <a name="availabilityZone" id="cdk-construct-proxy-bastion.BastionInstanceProps.property.availabilityZone"></a>

```typescript
public readonly availabilityZone: string;
```

- *Type:* string
- *Default:* Random zone.

In which AZ to place the instance within the VPC.

---

##### `blockDevices`<sup>Optional</sup> <a name="blockDevices" id="cdk-construct-proxy-bastion.BastionInstanceProps.property.blockDevices"></a>

```typescript
public readonly blockDevices: BlockDevice[];
```

- *Type:* aws-cdk-lib.aws_ec2.BlockDevice[]
- *Default:* Uses the block device mapping of the AMI

Specifies how block devices are exposed to the instance. You can specify virtual devices and EBS volumes.

Each instance that is launched has an associated root device volume,
either an Amazon EBS volume or an instance store volume.
You can use block device mappings to specify additional EBS volumes or
instance store volumes to attach to an instance when it is launched.

> [https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/block-device-mapping-concepts.html](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/block-device-mapping-concepts.html)

---

##### `detailedMonitoring`<sup>Optional</sup> <a name="detailedMonitoring" id="cdk-construct-proxy-bastion.BastionInstanceProps.property.detailedMonitoring"></a>

```typescript
public readonly detailedMonitoring: boolean;
```

- *Type:* boolean
- *Default:* false

Whether "Detailed Monitoring" is enabled for this instance Keep in mind that Detailed Monitoring results in extra charges.

> [http://aws.amazon.com/cloudwatch/pricing/](http://aws.amazon.com/cloudwatch/pricing/)

---

##### `init`<sup>Optional</sup> <a name="init" id="cdk-construct-proxy-bastion.BastionInstanceProps.property.init"></a>

```typescript
public readonly init: CloudFormationInit;
```

- *Type:* aws-cdk-lib.aws_ec2.CloudFormationInit
- *Default:* no CloudFormation init

Apply the given CloudFormation Init configuration to the instance at startup.

---

##### `initOptions`<sup>Optional</sup> <a name="initOptions" id="cdk-construct-proxy-bastion.BastionInstanceProps.property.initOptions"></a>

```typescript
public readonly initOptions: ApplyCloudFormationInitOptions;
```

- *Type:* aws-cdk-lib.aws_ec2.ApplyCloudFormationInitOptions
- *Default:* default options

Use the given options for applying CloudFormation Init.

Describes the configsets to use and the timeout to wait

---

##### `instanceName`<sup>Optional</sup> <a name="instanceName" id="cdk-construct-proxy-bastion.BastionInstanceProps.property.instanceName"></a>

```typescript
public readonly instanceName: string;
```

- *Type:* string
- *Default:* CDK generated name

The name of the instance.

---

##### `keyName`<sup>Optional</sup> <a name="keyName" id="cdk-construct-proxy-bastion.BastionInstanceProps.property.keyName"></a>

```typescript
public readonly keyName: string;
```

- *Type:* string
- *Default:* No SSH access will be possible.

Name of SSH keypair to grant access to instance.

---

##### `privateIpAddress`<sup>Optional</sup> <a name="privateIpAddress" id="cdk-construct-proxy-bastion.BastionInstanceProps.property.privateIpAddress"></a>

```typescript
public readonly privateIpAddress: string;
```

- *Type:* string
- *Default:* no association

Defines a private IP address to associate with an instance.

Private IP should be available within the VPC that the instance is build within.

---

##### `propagateTagsToVolumeOnCreation`<sup>Optional</sup> <a name="propagateTagsToVolumeOnCreation" id="cdk-construct-proxy-bastion.BastionInstanceProps.property.propagateTagsToVolumeOnCreation"></a>

```typescript
public readonly propagateTagsToVolumeOnCreation: boolean;
```

- *Type:* boolean
- *Default:* false

Propagate the EC2 instance tags to the EBS volumes.

---

##### `requireImdsv2`<sup>Optional</sup> <a name="requireImdsv2" id="cdk-construct-proxy-bastion.BastionInstanceProps.property.requireImdsv2"></a>

```typescript
public readonly requireImdsv2: boolean;
```

- *Type:* boolean
- *Default:* false

Whether IMDSv2 should be required on this instance.

---

##### `resourceSignalTimeout`<sup>Optional</sup> <a name="resourceSignalTimeout" id="cdk-construct-proxy-bastion.BastionInstanceProps.property.resourceSignalTimeout"></a>

```typescript
public readonly resourceSignalTimeout: Duration;
```

- *Type:* aws-cdk-lib.Duration
- *Default:* Duration.minutes(5)

The length of time to wait for the resourceSignalCount.

The maximum value is 43200 (12 hours).

---

##### `role`<sup>Optional</sup> <a name="role" id="cdk-construct-proxy-bastion.BastionInstanceProps.property.role"></a>

```typescript
public readonly role: IRole;
```

- *Type:* aws-cdk-lib.aws_iam.IRole
- *Default:* A role will automatically be created, it can be accessed via the `role` property

An IAM role to associate with the instance profile assigned to this Auto Scaling Group.

The role must be assumable by the service principal `ec2.amazonaws.com`:

---

*Example*

```typescript
const role = new iam.Role(this, 'MyRole', {
  assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com')
});
```


##### `securityGroup`<sup>Optional</sup> <a name="securityGroup" id="cdk-construct-proxy-bastion.BastionInstanceProps.property.securityGroup"></a>

```typescript
public readonly securityGroup: ISecurityGroup;
```

- *Type:* aws-cdk-lib.aws_ec2.ISecurityGroup
- *Default:* create new security group

Security Group to assign to this instance.

---

##### `sourceDestCheck`<sup>Optional</sup> <a name="sourceDestCheck" id="cdk-construct-proxy-bastion.BastionInstanceProps.property.sourceDestCheck"></a>

```typescript
public readonly sourceDestCheck: boolean;
```

- *Type:* boolean
- *Default:* true

Specifies whether to enable an instance launched in a VPC to perform NAT.

This controls whether source/destination checking is enabled on the instance.
A value of true means that checking is enabled, and false means that checking is disabled.
The value must be false for the instance to perform NAT.

---

##### `ssmSessionPermissions`<sup>Optional</sup> <a name="ssmSessionPermissions" id="cdk-construct-proxy-bastion.BastionInstanceProps.property.ssmSessionPermissions"></a>

```typescript
public readonly ssmSessionPermissions: boolean;
```

- *Type:* boolean
- *Default:* false

Add SSM session permissions to the instance role.

Setting this to `true` adds the necessary permissions to connect
to the instance using SSM Session Manager. You can do this
from the AWS Console.

NOTE: Setting this flag to `true` may not be enough by itself.
You must also use an AMI that comes with the SSM Agent, or install
the SSM Agent yourself. See
[Working with SSM Agent](https://docs.aws.amazon.com/systems-manager/latest/userguide/ssm-agent.html)
in the SSM Developer Guide.

---

##### `userData`<sup>Optional</sup> <a name="userData" id="cdk-construct-proxy-bastion.BastionInstanceProps.property.userData"></a>

```typescript
public readonly userData: UserData;
```

- *Type:* aws-cdk-lib.aws_ec2.UserData
- *Default:* A UserData object appropriate for the MachineImage's Operating System is created.

Specific UserData to use.

The UserData may still be mutated after creation.

---

##### `userDataCausesReplacement`<sup>Optional</sup> <a name="userDataCausesReplacement" id="cdk-construct-proxy-bastion.BastionInstanceProps.property.userDataCausesReplacement"></a>

```typescript
public readonly userDataCausesReplacement: boolean;
```

- *Type:* boolean
- *Default:* true iff `initOptions` is specified, false otherwise.

Changes to the UserData force replacement.

Depending the EC2 instance type, changing UserData either
restarts the instance or replaces the instance.

- Instance store-backed instances are replaced.
- EBS-backed instances are restarted.

By default, restarting does not execute the new UserData so you
will need a different mechanism to ensure the instance is restarted.

Setting this to `true` will make the instance's Logical ID depend on the
UserData, which will cause CloudFormation to replace it if the UserData
changes.

---

##### `vpcSubnets`<sup>Optional</sup> <a name="vpcSubnets" id="cdk-construct-proxy-bastion.BastionInstanceProps.property.vpcSubnets"></a>

```typescript
public readonly vpcSubnets: SubnetSelection;
```

- *Type:* aws-cdk-lib.aws_ec2.SubnetSelection
- *Default:* Private subnets.

Where to place the instance within the VPC.

---

### BastionProps <a name="BastionProps" id="cdk-construct-proxy-bastion.BastionProps"></a>

#### Initializer <a name="Initializer" id="cdk-construct-proxy-bastion.BastionProps.Initializer"></a>

```typescript
import { BastionProps } from 'cdk-construct-proxy-bastion'

const bastionProps: BastionProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-construct-proxy-bastion.BastionProps.property.instanceType">instanceType</a></code> | <code>aws-cdk-lib.aws_ec2.InstanceType</code> | Type of instance to launch. |
| <code><a href="#cdk-construct-proxy-bastion.BastionProps.property.vpc">vpc</a></code> | <code>aws-cdk-lib.aws_ec2.IVpc</code> | VPC to launch the instance in. |
| <code><a href="#cdk-construct-proxy-bastion.BastionProps.property.allowAllOutbound">allowAllOutbound</a></code> | <code>boolean</code> | Whether the instance could initiate connections to anywhere by default. |
| <code><a href="#cdk-construct-proxy-bastion.BastionProps.property.associatePublicIpAddress">associatePublicIpAddress</a></code> | <code>boolean</code> | Whether to associate a public IP address to the primary network interface attached to this instance. |
| <code><a href="#cdk-construct-proxy-bastion.BastionProps.property.availabilityZone">availabilityZone</a></code> | <code>string</code> | In which AZ to place the instance within the VPC. |
| <code><a href="#cdk-construct-proxy-bastion.BastionProps.property.blockDevices">blockDevices</a></code> | <code>aws-cdk-lib.aws_ec2.BlockDevice[]</code> | Specifies how block devices are exposed to the instance. You can specify virtual devices and EBS volumes. |
| <code><a href="#cdk-construct-proxy-bastion.BastionProps.property.detailedMonitoring">detailedMonitoring</a></code> | <code>boolean</code> | Whether "Detailed Monitoring" is enabled for this instance Keep in mind that Detailed Monitoring results in extra charges. |
| <code><a href="#cdk-construct-proxy-bastion.BastionProps.property.init">init</a></code> | <code>aws-cdk-lib.aws_ec2.CloudFormationInit</code> | Apply the given CloudFormation Init configuration to the instance at startup. |
| <code><a href="#cdk-construct-proxy-bastion.BastionProps.property.initOptions">initOptions</a></code> | <code>aws-cdk-lib.aws_ec2.ApplyCloudFormationInitOptions</code> | Use the given options for applying CloudFormation Init. |
| <code><a href="#cdk-construct-proxy-bastion.BastionProps.property.instanceName">instanceName</a></code> | <code>string</code> | The name of the instance. |
| <code><a href="#cdk-construct-proxy-bastion.BastionProps.property.keyName">keyName</a></code> | <code>string</code> | Name of SSH keypair to grant access to instance. |
| <code><a href="#cdk-construct-proxy-bastion.BastionProps.property.privateIpAddress">privateIpAddress</a></code> | <code>string</code> | Defines a private IP address to associate with an instance. |
| <code><a href="#cdk-construct-proxy-bastion.BastionProps.property.propagateTagsToVolumeOnCreation">propagateTagsToVolumeOnCreation</a></code> | <code>boolean</code> | Propagate the EC2 instance tags to the EBS volumes. |
| <code><a href="#cdk-construct-proxy-bastion.BastionProps.property.requireImdsv2">requireImdsv2</a></code> | <code>boolean</code> | Whether IMDSv2 should be required on this instance. |
| <code><a href="#cdk-construct-proxy-bastion.BastionProps.property.resourceSignalTimeout">resourceSignalTimeout</a></code> | <code>aws-cdk-lib.Duration</code> | The length of time to wait for the resourceSignalCount. |
| <code><a href="#cdk-construct-proxy-bastion.BastionProps.property.role">role</a></code> | <code>aws-cdk-lib.aws_iam.IRole</code> | An IAM role to associate with the instance profile assigned to this Auto Scaling Group. |
| <code><a href="#cdk-construct-proxy-bastion.BastionProps.property.securityGroup">securityGroup</a></code> | <code>aws-cdk-lib.aws_ec2.ISecurityGroup</code> | Security Group to assign to this instance. |
| <code><a href="#cdk-construct-proxy-bastion.BastionProps.property.sourceDestCheck">sourceDestCheck</a></code> | <code>boolean</code> | Specifies whether to enable an instance launched in a VPC to perform NAT. |
| <code><a href="#cdk-construct-proxy-bastion.BastionProps.property.ssmSessionPermissions">ssmSessionPermissions</a></code> | <code>boolean</code> | Add SSM session permissions to the instance role. |
| <code><a href="#cdk-construct-proxy-bastion.BastionProps.property.userData">userData</a></code> | <code>aws-cdk-lib.aws_ec2.UserData</code> | Specific UserData to use. |
| <code><a href="#cdk-construct-proxy-bastion.BastionProps.property.userDataCausesReplacement">userDataCausesReplacement</a></code> | <code>boolean</code> | Changes to the UserData force replacement. |
| <code><a href="#cdk-construct-proxy-bastion.BastionProps.property.vpcSubnets">vpcSubnets</a></code> | <code>aws-cdk-lib.aws_ec2.SubnetSelection</code> | Where to place the instance within the VPC. |
| <code><a href="#cdk-construct-proxy-bastion.BastionProps.property.database">database</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-construct-proxy-bastion.BastionProps.property.proxy">proxy</a></code> | <code>aws-cdk-lib.aws_rds.IDatabaseProxy</code> | *No description.* |
| <code><a href="#cdk-construct-proxy-bastion.BastionProps.property.proxySecurityGroup">proxySecurityGroup</a></code> | <code>aws-cdk-lib.aws_ec2.ISecurityGroup</code> | *No description.* |
| <code><a href="#cdk-construct-proxy-bastion.BastionProps.property.username">username</a></code> | <code>string</code> | *No description.* |

---

##### `instanceType`<sup>Required</sup> <a name="instanceType" id="cdk-construct-proxy-bastion.BastionProps.property.instanceType"></a>

```typescript
public readonly instanceType: InstanceType;
```

- *Type:* aws-cdk-lib.aws_ec2.InstanceType

Type of instance to launch.

---

##### `vpc`<sup>Required</sup> <a name="vpc" id="cdk-construct-proxy-bastion.BastionProps.property.vpc"></a>

```typescript
public readonly vpc: IVpc;
```

- *Type:* aws-cdk-lib.aws_ec2.IVpc

VPC to launch the instance in.

---

##### `allowAllOutbound`<sup>Optional</sup> <a name="allowAllOutbound" id="cdk-construct-proxy-bastion.BastionProps.property.allowAllOutbound"></a>

```typescript
public readonly allowAllOutbound: boolean;
```

- *Type:* boolean
- *Default:* true

Whether the instance could initiate connections to anywhere by default.

This property is only used when you do not provide a security group.

---

##### `associatePublicIpAddress`<sup>Optional</sup> <a name="associatePublicIpAddress" id="cdk-construct-proxy-bastion.BastionProps.property.associatePublicIpAddress"></a>

```typescript
public readonly associatePublicIpAddress: boolean;
```

- *Type:* boolean
- *Default:* public IP address is automatically assigned based on default behavior

Whether to associate a public IP address to the primary network interface attached to this instance.

---

##### `availabilityZone`<sup>Optional</sup> <a name="availabilityZone" id="cdk-construct-proxy-bastion.BastionProps.property.availabilityZone"></a>

```typescript
public readonly availabilityZone: string;
```

- *Type:* string
- *Default:* Random zone.

In which AZ to place the instance within the VPC.

---

##### `blockDevices`<sup>Optional</sup> <a name="blockDevices" id="cdk-construct-proxy-bastion.BastionProps.property.blockDevices"></a>

```typescript
public readonly blockDevices: BlockDevice[];
```

- *Type:* aws-cdk-lib.aws_ec2.BlockDevice[]
- *Default:* Uses the block device mapping of the AMI

Specifies how block devices are exposed to the instance. You can specify virtual devices and EBS volumes.

Each instance that is launched has an associated root device volume,
either an Amazon EBS volume or an instance store volume.
You can use block device mappings to specify additional EBS volumes or
instance store volumes to attach to an instance when it is launched.

> [https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/block-device-mapping-concepts.html](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/block-device-mapping-concepts.html)

---

##### `detailedMonitoring`<sup>Optional</sup> <a name="detailedMonitoring" id="cdk-construct-proxy-bastion.BastionProps.property.detailedMonitoring"></a>

```typescript
public readonly detailedMonitoring: boolean;
```

- *Type:* boolean
- *Default:* false

Whether "Detailed Monitoring" is enabled for this instance Keep in mind that Detailed Monitoring results in extra charges.

> [http://aws.amazon.com/cloudwatch/pricing/](http://aws.amazon.com/cloudwatch/pricing/)

---

##### `init`<sup>Optional</sup> <a name="init" id="cdk-construct-proxy-bastion.BastionProps.property.init"></a>

```typescript
public readonly init: CloudFormationInit;
```

- *Type:* aws-cdk-lib.aws_ec2.CloudFormationInit
- *Default:* no CloudFormation init

Apply the given CloudFormation Init configuration to the instance at startup.

---

##### `initOptions`<sup>Optional</sup> <a name="initOptions" id="cdk-construct-proxy-bastion.BastionProps.property.initOptions"></a>

```typescript
public readonly initOptions: ApplyCloudFormationInitOptions;
```

- *Type:* aws-cdk-lib.aws_ec2.ApplyCloudFormationInitOptions
- *Default:* default options

Use the given options for applying CloudFormation Init.

Describes the configsets to use and the timeout to wait

---

##### `instanceName`<sup>Optional</sup> <a name="instanceName" id="cdk-construct-proxy-bastion.BastionProps.property.instanceName"></a>

```typescript
public readonly instanceName: string;
```

- *Type:* string
- *Default:* CDK generated name

The name of the instance.

---

##### `keyName`<sup>Optional</sup> <a name="keyName" id="cdk-construct-proxy-bastion.BastionProps.property.keyName"></a>

```typescript
public readonly keyName: string;
```

- *Type:* string
- *Default:* No SSH access will be possible.

Name of SSH keypair to grant access to instance.

---

##### `privateIpAddress`<sup>Optional</sup> <a name="privateIpAddress" id="cdk-construct-proxy-bastion.BastionProps.property.privateIpAddress"></a>

```typescript
public readonly privateIpAddress: string;
```

- *Type:* string
- *Default:* no association

Defines a private IP address to associate with an instance.

Private IP should be available within the VPC that the instance is build within.

---

##### `propagateTagsToVolumeOnCreation`<sup>Optional</sup> <a name="propagateTagsToVolumeOnCreation" id="cdk-construct-proxy-bastion.BastionProps.property.propagateTagsToVolumeOnCreation"></a>

```typescript
public readonly propagateTagsToVolumeOnCreation: boolean;
```

- *Type:* boolean
- *Default:* false

Propagate the EC2 instance tags to the EBS volumes.

---

##### `requireImdsv2`<sup>Optional</sup> <a name="requireImdsv2" id="cdk-construct-proxy-bastion.BastionProps.property.requireImdsv2"></a>

```typescript
public readonly requireImdsv2: boolean;
```

- *Type:* boolean
- *Default:* false

Whether IMDSv2 should be required on this instance.

---

##### `resourceSignalTimeout`<sup>Optional</sup> <a name="resourceSignalTimeout" id="cdk-construct-proxy-bastion.BastionProps.property.resourceSignalTimeout"></a>

```typescript
public readonly resourceSignalTimeout: Duration;
```

- *Type:* aws-cdk-lib.Duration
- *Default:* Duration.minutes(5)

The length of time to wait for the resourceSignalCount.

The maximum value is 43200 (12 hours).

---

##### `role`<sup>Optional</sup> <a name="role" id="cdk-construct-proxy-bastion.BastionProps.property.role"></a>

```typescript
public readonly role: IRole;
```

- *Type:* aws-cdk-lib.aws_iam.IRole
- *Default:* A role will automatically be created, it can be accessed via the `role` property

An IAM role to associate with the instance profile assigned to this Auto Scaling Group.

The role must be assumable by the service principal `ec2.amazonaws.com`:

---

*Example*

```typescript
const role = new iam.Role(this, 'MyRole', {
  assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com')
});
```


##### `securityGroup`<sup>Optional</sup> <a name="securityGroup" id="cdk-construct-proxy-bastion.BastionProps.property.securityGroup"></a>

```typescript
public readonly securityGroup: ISecurityGroup;
```

- *Type:* aws-cdk-lib.aws_ec2.ISecurityGroup
- *Default:* create new security group

Security Group to assign to this instance.

---

##### `sourceDestCheck`<sup>Optional</sup> <a name="sourceDestCheck" id="cdk-construct-proxy-bastion.BastionProps.property.sourceDestCheck"></a>

```typescript
public readonly sourceDestCheck: boolean;
```

- *Type:* boolean
- *Default:* true

Specifies whether to enable an instance launched in a VPC to perform NAT.

This controls whether source/destination checking is enabled on the instance.
A value of true means that checking is enabled, and false means that checking is disabled.
The value must be false for the instance to perform NAT.

---

##### `ssmSessionPermissions`<sup>Optional</sup> <a name="ssmSessionPermissions" id="cdk-construct-proxy-bastion.BastionProps.property.ssmSessionPermissions"></a>

```typescript
public readonly ssmSessionPermissions: boolean;
```

- *Type:* boolean
- *Default:* false

Add SSM session permissions to the instance role.

Setting this to `true` adds the necessary permissions to connect
to the instance using SSM Session Manager. You can do this
from the AWS Console.

NOTE: Setting this flag to `true` may not be enough by itself.
You must also use an AMI that comes with the SSM Agent, or install
the SSM Agent yourself. See
[Working with SSM Agent](https://docs.aws.amazon.com/systems-manager/latest/userguide/ssm-agent.html)
in the SSM Developer Guide.

---

##### `userData`<sup>Optional</sup> <a name="userData" id="cdk-construct-proxy-bastion.BastionProps.property.userData"></a>

```typescript
public readonly userData: UserData;
```

- *Type:* aws-cdk-lib.aws_ec2.UserData
- *Default:* A UserData object appropriate for the MachineImage's Operating System is created.

Specific UserData to use.

The UserData may still be mutated after creation.

---

##### `userDataCausesReplacement`<sup>Optional</sup> <a name="userDataCausesReplacement" id="cdk-construct-proxy-bastion.BastionProps.property.userDataCausesReplacement"></a>

```typescript
public readonly userDataCausesReplacement: boolean;
```

- *Type:* boolean
- *Default:* true iff `initOptions` is specified, false otherwise.

Changes to the UserData force replacement.

Depending the EC2 instance type, changing UserData either
restarts the instance or replaces the instance.

- Instance store-backed instances are replaced.
- EBS-backed instances are restarted.

By default, restarting does not execute the new UserData so you
will need a different mechanism to ensure the instance is restarted.

Setting this to `true` will make the instance's Logical ID depend on the
UserData, which will cause CloudFormation to replace it if the UserData
changes.

---

##### `vpcSubnets`<sup>Optional</sup> <a name="vpcSubnets" id="cdk-construct-proxy-bastion.BastionProps.property.vpcSubnets"></a>

```typescript
public readonly vpcSubnets: SubnetSelection;
```

- *Type:* aws-cdk-lib.aws_ec2.SubnetSelection
- *Default:* Private subnets.

Where to place the instance within the VPC.

---

##### `database`<sup>Required</sup> <a name="database" id="cdk-construct-proxy-bastion.BastionProps.property.database"></a>

```typescript
public readonly database: string;
```

- *Type:* string

---

##### `proxy`<sup>Required</sup> <a name="proxy" id="cdk-construct-proxy-bastion.BastionProps.property.proxy"></a>

```typescript
public readonly proxy: IDatabaseProxy;
```

- *Type:* aws-cdk-lib.aws_rds.IDatabaseProxy

---

##### `proxySecurityGroup`<sup>Required</sup> <a name="proxySecurityGroup" id="cdk-construct-proxy-bastion.BastionProps.property.proxySecurityGroup"></a>

```typescript
public readonly proxySecurityGroup: ISecurityGroup;
```

- *Type:* aws-cdk-lib.aws_ec2.ISecurityGroup

---

##### `username`<sup>Required</sup> <a name="username" id="cdk-construct-proxy-bastion.BastionProps.property.username"></a>

```typescript
public readonly username: string;
```

- *Type:* string

---



