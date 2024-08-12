{ pkgs, lib, config, inputs, ... }:

{
  packages = with pkgs; [
    # https://devenv.sh/packages/
  ];

  languages.javascript = {
    enable = true;
    package = pkgs.nodejs;
    npm = {
      enable = true;
      install.enable = true;
    };
  };

  languages.go = {
    enable = true;
    package = pkgs.go;
  };
}
