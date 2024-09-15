import web3 from './web3';
import CertiGuardabi from './CertiGuardabi.json'; 
const contractAddress = '0xB929D55cdDeD441A47016a72630bf33BC433d658';
const contract = new web3.eth.Contract(CertiGuardabi, contractAddress);

export default contract;
 
      
