![banner](https://cloudflare-ipfs.com/ipfs/QmSWGEWUCThfBW127zPeF7oqwLwzVndB5mWDbgKCPnwCvE)

# Delegatable

![Test](https://github.com/kamescg/delegatable-sol/actions/workflows/test.yml/badge.svg)
![Coverage](https://github.com/kamescg/delegatable-sol/actions/workflows/coverage.yml/badge.svg)
![TS](https://badgen.net/badge/-/TypeScript?icon=typescript&label&labelColor=blue&color=555555)
[![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](http://perso.crans.org/besson/LICENSE.html)

Solidity framework for extending any contract with counterfactual revocable-delegation

## Getting Started

- [A high level summary of the goals of the Delegatable framework](https://mirror.xyz/0x55e2780588aa5000F464f700D2676fD0a22Ee160/pTIrlopsSUvWAbnq1qJDNKU1pGNLP8VEn1H8DSVcvXM).
- [A series of conversations about the framework on YouTube](https://www.youtube.com/watch?v=Sh1-epThZV0&list=PLJP4kXm9a01qRJaNzCU47gOzkn1eNAlFO).
- [A reference app called MobyMask](https://github.com/delegatable/MobyMask).
- [A JS library for creating & redeeming delegations](https://www.npmjs.com/package/eth-delegatable-utils).
- [A Delegatable Facet for Diamonds](./contracts/diamond/README.md)

## Deployment

These contracts can be deployed to a network by running:
`yarn deploy <networkName>`

Some of them [have been deployed already and can be reused](./deployments.md).

## Verification

These contracts can be verified on Etherscan.
`yarn verify`

## Testing

Run the unit tests locally with:
`yarn test`

## Coverage

Generate the test coverage report with:
`yarn coverage`

## Documentation

Add inline docs in the [natspec](https://docs.soliditylang.org/en/v0.8.15/natspec-format.html) format. The command `yarn docs` and `yarn docs:html` will generate the markdown and minimal html site which can be easily published.

