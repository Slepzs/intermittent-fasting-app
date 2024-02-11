{
  description = "Description for the project";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    devenv.url = "github:cachix/devenv";
    nix2container.url = "github:nlewo/nix2container";
    nix2container.inputs.nixpkgs.follows = "nixpkgs";
    mk-shell-bin.url = "github:rrbutani/nix-mk-shell-bin";
  };

  outputs = inputs @ {flake-parts, ...}:
    flake-parts.lib.mkFlake {inherit inputs;} {
      imports = [
        inputs.devenv.flakeModule
      ];
      systems = ["x86_64-linux" "i686-linux" "x86_64-darwin" "aarch64-linux" "aarch64-darwin"];

      perSystem = {
        config,
        self',
        inputs',
        pkgs,
        system,
        ...
      }: {
        # Per-system attributes can be defined here. The self' and inputs'
        # module parameters provide easy access to attributes of the same
        # system.

        # Equivalent to  inputs'.nixpkgs.legacyPackages.hello;
        # packages.default = pkgs.hello;

        devenv.shells = let
          projectRoot = "$(${pkgs.git}/bin/git rev-parse --show-toplevel)";
          nestjsRoot = "${projectRoot}/nestjs";
          supabaseRoot = "${projectRoot}/supabase";
          frontend = "${projectRoot}/frontend";
       
          pnpm = pkgs.nodePackages.pnpm;


          npm = pkgs.nodePackages.npm;

          shared = {
            enterShell = ''
              export PROJECT_ROOT=${projectRoot}
            '';
            process.implementation = "process-compose";

            languages.typescript.enable = true;

            packages = [pkgs.nodePackages.typescript-language-server pkgs.nodePackages.prettier];

            # env = {
            #   SMTP_HOST = "localhost";
            #   SMTP_PORT = 1025;
            #   SMTP_AUTH = "false";
            #   SMTP_FROM = "noreply@localhost";
            #   SMTP_NAME = "Next + Strapi application";
            # };

            services = {
              # mailhog = {
              #   enable = true;
              # };
            };
          };
        in {

          supabase = 
            shared
            // {
              name = "supabase";

              packages = [pkgs.nodejs-18_x npm] ++ shared.packages;

              processes = {
                supabase.exec = "bash -c 'cd ${supabaseRoot} && supabase start'";
              };

            };

          nestjs =
            shared
            // {
              name = "nestjs";

              # https://devenv.sh/reference/options/
              packages = [pkgs.nodejs-18_x pnpm] ++ shared.packages;

              processes = {
                nestjs.exec = "sleep 10 && ${pnpm}/bin/pnpm --dir ${nestjsRoot} run start:dev";
              };

              scripts = {
                install.exec = "${pnpm}/bin/pnpm --dir ${nestjsRoot} install";
              };
            };

          frontend =
            shared 
             // {
               name = "React Native";

               packages = [pkgs.nodejs-18_x pnpm] ++ shared.packages;

                processes = {
                  frontend.exec = "${pnpm}/bin/pnpm --dir ${frontend} run ios";
                };

             };
          

          default =
            shared
            // {
              packages = [pkgs.nodejs-18_x pnpm npm] ++ shared.packages;
              processes = {
                supabase = config.devenv.shells.supabase.processes.supabase;
                nestjs = config.devenv.shells.nestjs.processes.nestjs;
                frontend = config.devenv.shells.frontend.processes.frontend;
              };
              scripts = {
                install.exec = ''
                  ${config.devenv.shells.nestjs.scripts.install.exec}
                '';
              };

              # services = config.devenv.shells.strapi.services;
              services =
                shared.services
                // {
                  # redis.enable = true;
                };
            };
        };
      };
      flake = {
        # The usual flake attributes can be defined here, including system-
        # agnostic ones like nixosModule and system-enumerating ones, although
        # those are more easily expressed in perSystem.
      };
    };
}
