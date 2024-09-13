import { ethers } from "hardhat";
const helpers = require("@nomicfoundation/hardhat-network-helpers");

async function main() {
    const ROUTER_ADDRESS = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"; // Uniswap V2 Router address
    const TOKEN_A = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"; // USDC address
    const TOKEN_B = "0x6B175474E89094C44Da98b954EedeAC495271d0F"; // DAI address

    const TOKEN_HOLDER = "0xf584F8728B874a6a5c7A8d4d387C9aae9172D621"; // Address holding tokens to add as liquidity

    await helpers.impersonateAccount(TOKEN_HOLDER);
    const impersonatedSigner = await ethers.getSigner(TOKEN_HOLDER);

    // Amounts of tokens to add as liquidity
    const amountADesired = ethers.parseUnits("1000", 6); // Desired amount of USDC (6 decimals)
    const amountBDesired = ethers.parseUnits("1000", 18); // Desired amount of DAI (18 decimals)
    const amountAMin = ethers.parseUnits("900", 6); // Minimum amount of USDC (6 decimals)
    const amountBMin = ethers.parseUnits("900", 18); // Minimum amount of DAI (18 decimals)
    const to = TOKEN_HOLDER; // Address to receive liquidity tokens
    const deadline = Math.floor(Date.now() / 1000) + (60 * 10); // 10 minutes from now

    const USDC_Contract = await ethers.getContractAt("IERC20", TOKEN_A, impersonatedSigner);
    const DAI_Contract = await ethers.getContractAt("IERC20", TOKEN_B, impersonatedSigner);
    const ROUTER = await ethers.getContractAt("IUniswapV2Router", ROUTER_ADDRESS, impersonatedSigner);

    // Approve Router to spend tokens
    await USDC_Contract.approve(ROUTER_ADDRESS, amountADesired);
    await DAI_Contract.approve(ROUTER_ADDRESS, amountBDesired);

    // Add liquidity
    const tx = await ROUTER.addLiquidity(
        TOKEN_A,
        TOKEN_B,
        amountADesired,
        amountBDesired,
        amountAMin,
        amountBMin,
        to,
        deadline
    );

    // Wait for the transaction to be mined
    const receipt = await tx.wait();

    console.log("Liquidity added successfully!");
    console.log("Transaction hash:", tx.hash);
    console.log("Receipt:", receipt);

    // Optionally, fetch and display liquidity details if needed
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
