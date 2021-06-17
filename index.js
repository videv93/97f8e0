const { request, gql } = require('graphql-request')
const { sendMessageToSupperBotGroup } = require("./telegram_bot");
const { exportHtml } = require("./html_parser");
const GetAxieLatest = gql`
  query GetAxieLatest($auctionType: AuctionType, $criteria: AxieSearchCriteria, $from: Int, $sort: SortBy, $size: Int, $owner: String) {
    axies(auctionType: $auctionType, criteria: $criteria, from: $from, sort: $sort, size: $size, owner: $owner) {
      total
      results {
        ...AxieRowData
        __typename
      }
      __typename
    }
  }
  fragment AxieRowData on Axie {
    id
    image
    class
    name
    genes
    owner
    class
    stage
    title
    breedCount
    level
    parts {
      ...AxiePart
      __typename
    }
    stats {
      ...AxieStats
      __typename
    }
    auction {
      ...AxieAuction
      __typename
    }
    __typename
  }
  fragment AxiePart on AxiePart {
    id
    name
    class
    type
    specialGenes
    stage
    abilities {
      ...AxieCardAbility
      __typename
    }
    __typename
  }
  fragment AxieCardAbility on AxieCardAbility {
    id
    name
    attack
    defense
    energy
    description
    backgroundUrl
    effectIconUrl
    __typename
  }
  fragment AxieStats on AxieStats {
    hp
    speed
    skill
    morale
    __typename
  }
  fragment AxieAuction on Auction {
    startingPrice
    endingPrice
    startingTimestamp
    endingTimestamp
    duration
    timeLeft
    currentPrice
    currentPriceUSD
    suggestedPrice
    seller
    listingIndex
    state
    __typename
  }
`;

const GetRecentlyAxiesSold = gql`
query GetRecentlyAxiesSold($from: Int, $size: Int) {
  settledAuctions {
    axies(from: $from, size: $size) {
      total
      results {
        ...AxieSettledBrief
        transferHistory {
          ...TransferHistoryInSettledAuction
          __typename
        }
        __typename
      }
      __typename
    }
    __typename
  }
}
fragment AxieSettledBrief on Axie {
  id
  name
  image
  class
  breedCount
  __typename
}
fragment TransferHistoryInSettledAuction on TransferRecords {
  total
  results {
    ...TransferRecordInSettledAuction
    __typename
  }
  __typename
}
fragment TransferRecordInSettledAuction on TransferRecord {
  from
  to
  txHash
  timestamp
  withPrice
  withPriceUsd
  fromProfile {
    name
    __typename
  }
  toProfile {
    name
    __typename
  }
  __typename
}
`

const variables = {
  auctionType: "Sale",
  from: 0,
  size: 10,
  sort: "Latest"
};

const headers = {
  authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SWQiOjMzOTUyNSwiaWF0IjoxNjIzNTUzMjQxLCJleHAiOjE2MjQxNTgwNDEsImlzcyI6IkF4aWVJbmZpbml0eSJ9.vszqhzg7M2fwnHHMLYwwiVcw-ELwjIv8ohJdYAlA2L8"
}

const isCheapestAxie = (axie) => {
  return +axie.auction.currentPriceUSD < 25;
}
const cb = () => {
  request('https://axieinfinity.com/graphql-server-v2/graphql', GetAxieLatest, variables, headers)
  .then((data) => {
    //console.log(data);
    const { axies: { results, total }} = data;
    const cheapeastAxies = results.filter(axie => isCheapestAxie(axie));
    if (cheapeastAxies.length) {
      const html = exportHtml(cheapeastAxies.map(axie => ([`https://marketplace.axieinfinity.com/axie/${axie.id}`, axie.auction.currentPriceUSD])))
      sendMessageToSupperBotGroup(html);
    }
  })
  .catch(err => {
    console.log(err);
  })
}

"congress crunch cargo convince poet orphan oxygen embody visit wage evil dove";

setInterval(cb, 5000);