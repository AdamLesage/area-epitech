{
  description = ''
    Area Flake
  '';

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-24.11";
  };

  outputs = { self, nixpkgs, ... }:
    let
      system = "x86_64-linux";
    in {
      devShells."${system}".default = let
        pkgs = import nixpkgs {
          inherit system;
          # Allow unfree packages by setting this inside the nixpkgs import
          config.allowUnfree = true;
        };
      in pkgs.mkShell {
        env = {
          PRISMA_QUERY_ENGINE_LIBRARY = "${pkgs.prisma-engines}/lib/libquery_engine.node";
          PRISMA_QUERY_ENGINE_BINARY = "${pkgs.prisma-engines}/bin/query-engine";
          PRISMA_SCHEMA_ENGINE_BINARY = "${pkgs.prisma-engines}/bin/schema-engine";
        };
        packages = with pkgs; [
          bashInteractiveFHS
          pkg-config
          nodejs_22
          android-studio
          nodemon
          prisma
          openssl
          nushell
          python3
          docker-compose
        ];

        shellHook = ''
          echo Custom cpp nix-shell !
        '';
      };
    };
}
