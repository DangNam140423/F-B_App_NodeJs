const { default: axios } = require('axios');
const { Kafka, Partitioners, logLevel } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['localhost:9092'],
    logLevel: logLevel.ERROR
})

// const producer = kafka.producer({ createPartitioner: Partitioners.LegacyPartitioner });
// export default producer;
const consumer = kafka.consumer({ groupId: 'test-group' })

const run = async () => {
    try {
        // await disconnectProducer(); // Đảm bảo producer được ngắt kết nối
        await consumer.disconnect(); // Ngắt kết nối consumer nếu đã kết nối trước đó

        // Producing
        // await producer.connect();
        // await producer.send({
        //     topic: 'ticket-notifications',
        //     messages: [
        //         { value: 'Hello KafkaJS user!!!' },
        //     ],
        // })

        // Consuming
        await consumer.connect()
        await consumer.subscribe({ topic: 'ticket-notifications', fromBeginning: true })

        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                // console.log({
                //     partition,
                //     offset: message.offset,
                //     value: JSON.parse(message.value.toString()),
                // });
                // console.log(JSON.parse(message.value.toString()));

                await axios.post('https://exp.host/--/api/v2/push/send', JSON.parse(message.value.toString()));
            },
        })

        console.log("Connected Kafka");
    } catch (error) {
        console.error(error);
    }
}

// const disconnectProducer = async () => {
//     try {
//         await producer.disconnect();
//     } catch (error) {
//         console.error('Error disconnecting producer:', error);
//     }
// };

run();

