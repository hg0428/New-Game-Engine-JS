{ pkgs }: {
  deps = [
    pkgs.nodePackages.vscode-langservers-extracted
    pkgs.nodePackages.typescript-language-server
    pkgs.python39Full
    pkgs.python39Packages.pip.out
  ];
}