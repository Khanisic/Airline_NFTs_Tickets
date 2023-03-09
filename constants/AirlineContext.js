import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import axios from "axios";
import html2canvas from "html2canvas";
import { ContractAddress, ABI, voucher } from "./constants";
import { NFTStorage, Blob } from "nft.storage";
import { useRouter } from "next/router";
const NFT_STORAGE_TOKEN = process.env.NEXT_PUBLIC_NFT_STORAGE_TOKEN;
const client = new NFTStorage({ token: NFT_STORAGE_TOKEN });
const fetchContract = (signerOrProvider) =>
  new ethers.Contract(ContractAddress, ABI, signerOrProvider);

export const AirlineContext = React.createContext();

export const AirlineProvider = ({ children }) => {
  const [finalURIs, setFinalURIs] = useState([]);
  const [currentPath, setCurrentPath] = useState(0);
  const [uris, setUris] = useState([]);
  const [tripDetails, setTripDetails] = useState("");
  const [capturingDone, setCapturingDone] = useState(false);
  const router = useRouter();
  const [details, setDetails] = useState({
    fname: "",
    lname: "",
    pno: "",
    gender: "",
    dob: "",
  });
  const captureImage = async (
    divRef,
    setScale,
    setCurrentPath,
    noOfTickets,
    setIsCapturing
  ) => {
    const divToCapture = divRef.current;
    let imgUrl = "";
    html2canvas(divToCapture).then((canvas) => {
      var img = canvas.toDataURL();
      dataURItoBlob(img).then((url) => {
        setUris([...uris, "https://nftstorage.link/ipfs" + url]);
        if (noOfTickets - 1 == currentPath) {
          setCurrentPath(0);
          setScale("scale-100");
          setIsCapturing(false);
          setCapturingDone(true);
        } else {
          setCurrentPath((prevPath) => prevPath + 1);
        }
      });
    });

    return imgUrl;
  };

  const dataURItoBlob = async (dataURI) => {
    var byteString;
    try {
      if (dataURI.split(",")[0].indexOf("base64") >= 0)
        byteString = atob(dataURI.split(",")[1]);
      else byteString = unescape(dataURI.split(",")[1]);
      var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
      var ia = new Uint8Array(byteString.length);
      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      var someBinaryImageData = new Blob([ia]);
      const imageFile = new File([someBinaryImageData], "nft.png", {
        type: mimeString,
      });
      const metadata = await client.store({
        name: "Flight Ticket",
        description: "Flight Ticket booked",
        image: imageFile,
      });
      return metadata.data.image.pathname.replace("/", "");
    } catch (error) {
      console.log("Error uploading to IPFS");
    }
  };

  const fetchNFTs = async (setLoading) => {
    setLoading(true);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = fetchContract(provider);

    const data = await contract.fetchMyNFTs();
    return data;
    // const items = await Promise.all(
    //   data.map(async ({ tokenId, seller, owner, price: unformattedPrice }) => {
    //     const tokenURI = await contract.tokenURI(tokenId);
    //     const {
    //       data: { image, name, description },
    //     } = await axios.get(tokenURI);
    //     const price = ethers.utils.formatUnits(
    //       unformattedPrice.toString(),
    //       "ether"
    //     );

    //     image.replace("https:ipfs.io", "https://infura-ipfs.io");
    //     console.log(image);

    //     return {
    //       price,
    //       tokenId: tokenId.toNumber(),
    //       seller,
    //       owner,
    //       image,
    //       name,
    //       description,
    //       tokenURI,
    //     };
    //   })
    // );
    // return items;
  };

  useEffect(() => {
    if (tripDetails && tripDetails.paths.length == uris.length) {
      createNFT();
    }
  }, [uris]);
  console.log(tripDetails);
  const createNFT = async () => {
    let innerURIs = [];
    for (let i = 0; i < uris.length; i++) {
      let data = JSON.stringify({
        name: details.fname + " " + details.lname,
        description: `This is a flight from ${tripDetails.paths[i].departureAirportCode} to ${tripDetails.paths[i].arrivalAirportCode}`,
        image: uris[i],
        airlineCode: tripDetails.paths[i].airlineCode,
        departureAirportCode: tripDetails.paths[i].departureAirportCode,
        arrivalAirportCode: tripDetails.paths[i].arrivalAirportCode,
        departureDateTime: tripDetails.paths[i].departureDateTime,
        arrivalDateTime: tripDetails.paths[i].arrivalDateTime,
      });

      try {
        console.log(i, uris.length);
        let metadata = new Blob([data]);
        let cid = await client.storeBlob(metadata);
        let url = "https://ipfs.io/ipfs/" + cid;
        // Push the URL to an array
        innerURIs.push(url);
      } catch (error) {
        console.log("Error uploading to create nft");
      }
    }
    setFinalURIs(innerURIs);
  };

  const recover = async () => {
    //   const voucher = { api: "abcabc" };
    //   const types = {
    //     AirlineNFTVoucher: [{ name: "api", type: "string" }],
    //   };
    //   try {
    //     const provider = new ethers.providers.Web3Provider(window.ethereum);
    //     const signer = provider.getSigner();
    //     const signature = await signer._signTypedData(domain, types, voucher);
    //     const contract = new ethers.Contract(ContractAddress, ABI, signer);
    //     const create = await contract.recover({
    //       ...voucher,
    //       signature,
    //     });
    //     console.log(create);
    //     console.log({
    //       ...voucher,
    //       signature,
    //     });
    //     return {
    //       ...voucher,
    //       signature,
    //     };
    //   } catch (err) {
    //     console.log(err);
    //   }
    // try {
    //   const provider = new ethers.providers.Web3Provider(window.ethereum);
    //   const signer = provider.getSigner();
    //
    //   const create = await contract.tokenURI(1);
    //   console.log(create);
    // } catch (err) {
    //   console.log(err);
    // }
  };

  const mintNFT = async () => {
    console.log(finalURIs.length, tripDetails && tripDetails.paths.length);
    if (tripDetails && finalURIs.length == tripDetails.paths.length) {
      console.log("Last step, minting");
      console.log(finalURIs);
      const nft = {
        price: ethers.utils
          .parseUnits((tripDetails.price / 100000).toString(), "ether")
          .toString(),
        uri: finalURIs,
        buyer: "0x2bc347a4d3248be7FA4AD63872E3aE3F420aADa7",
      };
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(ContractAddress, ABI, signer);
        const create = await contract.safeMint(voucher, nft, {
          value: ethers.utils
            .parseUnits((tripDetails.price / 100000).toString(), "ether")
            .toString(),
        });
        await create.wait();
        router.push("/");
        return create;
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    mintNFT();
  }, [finalURIs]);

  //   const connectWallet = async () => {
  //     if (!window.ethereum) return alert('Please install MetaMask.');

  //     const accounts = await window.ethereum.request({
  //       method: 'eth_requestAccounts',
  //     });

  //     setCurrentAccount(accounts[0]);
  //     window.location.reload();
  //   };

  //   const checkIfWalletIsConnect = async () => {
  //     if (!window.ethereum) return alert('Please install MetaMask.');

  //     const accounts = await window.ethereum.request({ method: 'eth_accounts' });

  //     if (accounts.length) {
  //       setCurrentAccount(accounts[0]);
  //     } else {
  //       console.log('No accounts found');
  //     }
  //   };

  //   useEffect(() => {
  //     checkIfWalletIsConnect();
  //   }, []);

  const test = "Abd";

  return (
    <AirlineContext.Provider
      value={{
        test,
        captureImage,
        currentPath,
        setCurrentPath,
        tripDetails,
        setTripDetails,
        uris,
        setUris,
        details,
        setDetails,
        capturingDone,
        setCapturingDone,
        createNFT,
        recover,
        fetchNFTs,
      }}
    >
      {children}
    </AirlineContext.Provider>
  );
};
