// console.log("hello world")
new Vue({
    el: "#root",
    data:{
        title: "Health Reporting Dashboard",
        orders:[
            {name:"Chris Nwamba", description:"Amoeba, Cholera", address:"Kakuma 1", telephone:"08082092000", open:true},
            {name:"William Imoh", description:"Diahorrea, TB, Malaria", address:"Kakuma 2", telephone:"08082818700", open:true}
        ]
    },
    created(){
        var pusher = new Pusher('ec243ed9717ccdd5bc05',{
            cluster:'ap2',
            encrypted:true
        })
        var channel = pusher.subscribe('orders')
        channel.bind('customerOrder', (data) => {
            console.log(data)
            this.orders.push(data)
        })
    },
    methods:{
        // close completed order
        close(orderToClose){
            if ( confirm('Are you sure you want to close this report?') === true){
                this.orders = this.orders.map(order => {
                    if(order.name !== orderToClose.name && order.description !== orderToClose.description){
                        return order;
                    }
                    const change = {
                        open: !order.open
                    }
                    return change;
                })
            } 
        }
    }
})