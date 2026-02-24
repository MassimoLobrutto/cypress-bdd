param (
    [string]$ruleName, 
    [string]$ruleDesc,    
    [string]$Priority
)

$nsgNames = @('internal-ingress-nsg')
$rulePort = 443,80
  
  $myIp = (Invoke-WebRequest -uri "http://ifconfig.me/ip").Content
  
  function AddOrUpdateRDPRecord {
      Process {
          $nsg = Get-AzNetworkSecurityGroup -Name $_
          $ruleExists = (Get-AzNetworkSecurityRuleConfig -NetworkSecurityGroup $nsg).Name.Contains($ruleName);
  
          if($ruleExists)
          {
              # Update the existing rule with the new IP address
              Set-AzNetworkSecurityRuleConfig `
                  -Name $ruleName `
                  -Description $ruleDesc `
                  -Access Allow `
                  -Protocol TCP `
                  -Direction Inbound `
                  -Priority $Priority `
                  -SourceAddressPrefix $myIp `
                  -SourcePortRange * `
                  -DestinationAddressPrefix * `
                  -DestinationPortRange $rulePort `
                  -NetworkSecurityGroup $nsg
          }
          else
          {
              # Create a new rule
              $nsg | Add-AzNetworkSecurityRuleConfig `
                  -Name $ruleName `
                  -Description $ruleDesc `
                  -Access Allow `
                  -Protocol TCP `
                  -Direction Inbound `
                  -Priority $Priority `
                  -SourceAddressPrefix $myIp `
                  -SourcePortRange * `
                  -DestinationAddressPrefix * `
                  -DestinationPortRange $rulePort
          }
  
          # Save changes to the NSG
          $nsg | Set-AzNetworkSecurityGroup
      }
  }
  $nsgNames | AddOrUpdateRDPRecord