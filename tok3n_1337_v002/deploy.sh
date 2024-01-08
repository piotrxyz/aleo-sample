APPNAME="tok3n_1337_v002"
PRIVATEKEY="APrivateKey1zkp7jLrCKT8ZEv379Q2yrABFMWtGK6cYNjFJJbwd7hiLBt6"

RECORD="{
          owner: aleo1nah5n7nfg9d5s7jsrn9rm5v5md05qlxj0zkguutd7jfjlqjukvqsrrgwxp.private,
          microcredits: 145332640u64.private,
          _nonce: 7936951786281702625602188918158889725915775712152902506226397559321768159165group.public
        }"

snarkos developer deploy "${APPNAME}.aleo" --private-key "${PRIVATEKEY}" --query "https://api.explorer.aleo.org/v1" --path "./build/" --broadcast "https://api.explorer.aleo.org/v1/testnet3/transaction/broadcast" --priority-fee 9000000 --record "${RECORD}"