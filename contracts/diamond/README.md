# Delegatable Diamond

![A diamond with lightning coming out of it](../../img/diamond.png)

[DelegatableFacet.sol](../DelegatableFacet.sol) is a standalone contract for adding [The Delegatable Framework](../../README.md) to [ERC-2535 Diamond](https://eips.ethereum.org/EIPS/eip-2535) contracts. Diamonds are a type of proxy contract that allows people to add new "facets" to it (like adding a method to a mutable object).

Once this facet is added to a Diamond, it will have all of [the Delegatable interfaces](../interfaces/IDelegatable.sol) exposed.

## Setup and Requirements

Any authority checks in the other facets must not use `msg.sender` directly, but should use our special `_msgSender()` override method, per the normal Delegatable integration process. You can see an example of this substitution in [our modified LibDiamond file](./libraries/LibDiamond.sol).

If you're on the Ethereum mainnet, you can use our pre-deployed [Delegatable Diamond Singleton at 0x22B7922dEA4816799380B78944d45669a37f4e98](https://etherscan.io/address/0x22b7922dea4816799380b78944d45669a37f4e98#code).

If you're using [ERC-712 signTypedData signatures](https://eips.ethereum.org/EIPS/eip-712), it's probably a best practice to re-use your `domainHash` between other signatures and the Delegatable ones. To reuse the domainHash storage with this facet, you can copy the `AppStorage` usage in [DelegatableFacet.sol](./DelegatableFacet.sol).

If you're already using that exact pattern for your `domainHash`, you can simply add the facet with no init code. If you are not using that exact pattern for storing a `domainHash`, you must add your facet with an initCode for setting that value:

```javascript
// Generate delegatable init code to generate domain typehash
const populatedTx =
  await DelegatableFacet.populateTransaction.setDomainHash(CONTRACT_NAME);
const initTypehashBytes = populatedTx.data;
// Add delegatable facet to the diamond
await Diamond.diamondCut(
  [
    {
      facetAddress: '0x22B7922dEA4816799380B78944d45669a37f4e98',
      action: FacetCutAction.Add,
      functionSelectors: getSelectors(DelegatableFacet),
    },
  ],
  // run delegatable init code to generate domain typehash
  '0x22B7922dEA4816799380B78944d45669a37f4e98',
  initTypehashBytes
);
```

Once you've done that setup, you'll be ready to get started issuing delegations and letting people use them to call methods on your behalf!

Some further reading to get set up:
- [A high level summary of the goals of the Delegatable framework](https://mirror.xyz/0x55e2780588aa5000F464f700D2676fD0a22Ee160/pTIrlopsSUvWAbnq1qJDNKU1pGNLP8VEn1H8DSVcvXM).
- [A series of conversations about the framework on YouTube](https://www.youtube.com/watch?v=Sh1-epThZV0&list=PLJP4kXm9a01qRJaNzCU47gOzkn1eNAlFO).
- [A reference app called MobyMask](https://github.com/delegatable/MobyMask).
- [A JS library for creating & redeeming delegations](https://www.npmjs.com/package/eth-delegatable-utils).
