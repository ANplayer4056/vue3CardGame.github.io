import {createApp,ref,onMounted,computed,watch} from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.1.4/vue.esm-browser.min.js' 

createApp({
  setup() {
    
    // 暫存前一個翻開的卡片訊息
    const tempCard = ref({});
    // 控制是否可以繼續翻牌
    const canChoose = ref(true);
    // 卡片翻面控制
    function transCard(item){
      // 如果還不能翻牌或是該點選的牌已經被翻開了
      if(canChoose.value === false || item.ispair === true) return;
      
      if (Object.keys(tempCard.value).length === 0){
        // 紀錄要配對的第一張牌
        tempCard.value = item;
        item.ispair = true;
      }else{
        // 如果點擊速度太快點到同一張返回
        if(item.id === tempCard.value.id) return;
        // 禁止繼續翻牌
        canChoose.value = false;
        
        item.ispair = true;
        // 達到兩張都翻開後在判斷的效果
        setTimeout(()=>{
          checkPair(item)
        },1000);
      }
    }
    
    function checkPair(item){
      // 判斷是否配對成功
        if(item.cardText === tempCard.value.cardText) {
          
          // 配對成功 
          setTimeout(()=>{
            // 清除暫存的第一張牌
            tempCard.value = {};
            // 允許繼續翻牌
            canChoose.value = true;
            count.value++;
          },1000);
          
        }else{
          // 配對失敗 >> 兩張卡牌恢復覆蓋狀態
          item.ispair = false;
          resetPrevCard();
        }
    }
    
    function resetPrevCard(){
      // 第一張牌恢復覆蓋狀態
      cardlist.value.forEach(ele=>{
        if(ele.id === tempCard.value.id){
          ele.ispair = false;
          
          // 清除第一張牌的暫存
          tempCard.value = {};
          
          // 允許繼續翻牌
          setTimeout(()=>{
            canChoose.value = true;
          },1000);
        }
      })
    }
    
    // 卡片花色資料建立
    const cardlist = ref([
      { id: 1 , cardText: '♠1' , cardColor: 'black' , ispair: false, sortIdx: 0},
      { id: 5 , cardText: '♠1' , cardColor: 'black' , ispair: false, sortIdx: 0},
      { id: 7 , cardText: '♥2' , cardColor: 'red' , ispair: false, sortIdx: 0},
      { id: 4 , cardText: '♥2' , cardColor: 'red' , ispair: false, sortIdx: 0},
      { id: 2 , cardText: '♦7' , cardColor: 'black' , ispair: false, sortIdx: 0},
      { id: 14 , cardText: '♦7' , cardColor: 'black' , ispair: false, sortIdx: 0},
      { id: 12 , cardText: '♣7' , cardColor: 'red' , ispair: false, sortIdx: 0},
      { id: 8 , cardText: '♣7' , cardColor: 'red' , ispair: false, sortIdx: 0},
      { id: 9, cardText: '♠9' , cardColor: 'black' , ispair: false, sortIdx: 0},
      { id: 3, cardText: '♠9' , cardColor: 'black' , ispair: false, sortIdx: 0},
      { id: 16, cardText: '♥J' , cardColor: 'red' , ispair: false, sortIdx: 0},
      { id: 11, cardText: '♥J' , cardColor: 'red' , ispair: false, sortIdx: 0},
      { id: 10, cardText: '♦Q' , cardColor: 'black' , ispair: false, sortIdx: 0},
      { id: 15, cardText: '♦Q' , cardColor: 'black' , ispair: false, sortIdx: 0},
      { id: 6, cardText: '♣K' , cardColor: 'red' , ispair: false, sortIdx: 0},
      { id: 13, cardText: '♣K' , cardColor: 'red' , ispair: false, sortIdx: 0},
    ])
    
    // 產生隨機順序
    let randomIndexList = [];
    function randomIdx(){
      for(let i = 0; i < 16; i++ ){
        let num = parseInt(Math.random()*16);
        if(!randomIndexList.includes(num)){
          randomIndexList.push(num);
        }
      }
      for(let i = 0; i < 16; i++ ){
        if(!randomIndexList.includes(i)){
          if( i % 2 === 0){
            randomIndexList.push(i);
          }else{
            randomIndexList.unshift(i);
          }
        }
      }
    }
    
    // 寫入排序順序
    function assignIdx(){
      cardlist.value.forEach((ele,idx)=>{
        ele.sortIdx = randomIndexList[idx];
      })
    }
    
    // 排序好要渲染的牌
    const remderCards = computed(()=>{
      return cardlist.value.sort((a,b)=>{
        return a.sortIdx - b.sortIdx;
      })
    })
    
    onMounted(()=>{
      randomIdx();
      assignIdx();
    })
    
    
    // 監聽是否全部配對成功
    const count = ref(0);
    watch(count,(newValue)=>{
      if(newValue === 8){
        alert("恭喜挑戰遊戲成功!!!")
      }
    })
    
    
    // 重新一局遊戲
    function restartGame(){
      
      // 計數器歸零
      count.value = 0;
      
      // 清除第一張牌的暫存
      tempCard.value = {};
      
      // 重新寫入隨機順序
      randomIdx();
      assignIdx();
      
      // 還原蓋牌狀態
      cardlist.value.forEach(ele=>{
        ele.ispair = false;
      })
    }
    
    return {
      transCard,
      remderCards,
      count,
      restartGame
    }
  }
}).mount('#app')