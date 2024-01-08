APPNAME="tok3n_1337_v001"
PRIVATEKEY="APrivateKey1zkp7jLrCKT8ZEv379Q2yrABFMWtGK6cYNjFJJbwd7hiLBt6"

RECORD="{
          owner: aleo1nah5n7nfg9d5s7jsrn9rm5v5md05qlxj0zkguutd7jfjlqjukvqsrrgwxp.private,
          microcredits: 46335000u64.private,
          _nonce: 4895605283707163328096639064680307131805894530905772745645448622237373860662group.public
        }"

snarkos developer execute "${APPNAME}.aleo" "mint" 1000000000u64 --private-key "${PRIVATEKEY}" --query "https://api.explorer.aleo.org/v1" --broadcast "https://api.explorer.aleo.org/v1/testnet3/transaction/broadcast" --priority-fee 1000000 --record "${RECORD}"