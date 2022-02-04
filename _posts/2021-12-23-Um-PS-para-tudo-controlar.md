---
title: Um PS para todos controlar (beta) ~~apagar~~
date: 2021-12-23
---

##### Código em PS para quando precisar dar autorização para todos os arquivos e diretorios a partir de um path.

```powershell
$Path = "D:"
$Principal = [System.Security.Principal.WindowsIdentity]::GetCurrent().Name
$AcessRule = (New-Object System.Security.AccessControl.FileSystemAccessRule(
			$Principal,
			"FullControl", # [System.Security.AccessControl.FileSystemRights]
			"ContainerInherit, ObjectInherit", # [System.Security.AccessControl.InheritanceFlags]
			"InheritOnly",      # [System.Security.AccessControl.PropagationFlags]
			"Allow"      # [System.Security.AccessControl.AccessControlType]
		))
$AcessRule2 = (New-Object System.Security.AccessControl.FileSystemAccessRule(
			$Principal,
			"FullControl", # [System.Security.AccessControl.FileSystemRights]
			"None", # [System.Security.AccessControl.InheritanceFlags]
			"None",      # [System.Security.AccessControl.PropagationFlags]
			"Allow"      # [System.Security.AccessControl.AccessControlType]
		))
Get-ChildItem $Path  -Directory -Recurse | ForEach-Object {
	$SubPath = $_.FullName
	echo $SubPath
	$Acl = Get-Acl $SubPath
	$Acl.AddAccessRule($AcessRule)
	$Acl.SetOwner($Principal)
	$acl | Set-Acl $SubPath
}

Get-ChildItem $Path -Recurse | ForEach-Object {
	$SubPath = $_.FullName
	echo $SubPath
	$Acl = Get-Acl $SubPath
	$Acl.AddAccessRule($AcessRule2)
	$Acl.SetOwner($Principal)
	$acl | Set-Acl $SubPath
}

```

No final funcionou parcialmente, mas serviu para eu controlar todos os arquivos que eu precisava e copiar eles para o SSD antes de formatar o HD.
