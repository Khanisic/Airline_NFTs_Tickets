import Airline from './Airline.json';

export const ABI = Airline.abi;
export const ContractAddress = '0x8E31E715a06dc0C37d02D809183f2D904ECb5Fc7'

const SIGNING_DOMAIN_NAME = "AirlineTickets";
const SIGNING_DOMAIN_VERSION = "1";
const chainId = 80001;

export const voucher = {
    "api": "abcabc",
    "signature": "0xd2bb8dfc24f577ae732e2d414a5b66c468e9e3bd18791da9e9303a7ea3f9e2f4392666ec7ac3c1fd50ebae5c385ffa0110f066677fcf810b353979d290c988631b"
}
export const domain = {
  name: SIGNING_DOMAIN_NAME,
  version: SIGNING_DOMAIN_VERSION,
  verifyingContract: ContractAddress,
  chainId,
};
