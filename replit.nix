{ pkgs }: {
	deps = [
		pkgs.mess
  pkgs.unzip
  pkgs.mess
  pkgs.nodejs-18_x
    pkgs.nodePackages.typescript-language-server
    pkgs.yarn
    pkgs.replitPackages.jest
	];
}