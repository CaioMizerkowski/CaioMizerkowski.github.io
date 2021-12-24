---
title: Um PS para todos controlar ~~apagar~~
date: 2021-12-23
---

##### Código em PS para quando precisar dar autorização para todos os arquivos e diretorios a partir de um path.

```PS
$Path = "D:"
$Principal = "Caio"
$AcessRule = New-Object System.Security.AccessControl.FileSystemAccessRule(
			$Principal,
			"FullControl", # [System.Security.AccessControl.FileSystemRights]
			"ContainerInherit, ObjectInherit", # [System.Security.AccessControl.InheritanceFlags]
			"InheritOnly",      # [System.Security.AccessControl.PropagationFlags]
			"Allow"      # [System.Security.AccessControl.AccessControlType]
		)
Get-ChildItem $Path  -Directory -Recurse | ForEach-Object {
	$SubPath = $_.FullName
	echo $SubPath
	$Acl = Get-Acl $SubPath
	$Acl.AddAccessRule($AcessRule)
	$acl | Set-Acl $SubPath
}
```
