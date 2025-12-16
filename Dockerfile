FROM node:20-slim

# CMD [ "cat", "/etc/resolv.conf" ]

# Build from source
COPY . /
WORKDIR /
# TODO: freeze installed pnpm version (broken because of version incompability)
# RUN source "$HOME/.shrc" && pnpm i --frozen-lockfile && pnpm run notsc-build

ENTRYPOINT ["./entrypoint.sh"]
