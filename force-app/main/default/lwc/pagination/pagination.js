import { LightningElement, track, api } from 'lwc';

export default class Pagination extends LightningElement {

    @api totaldata;
    @track startingRecord = 0; //start record position per page
    @track endingRecord = 0; //end record position per page
    @track pageSize = 10; //default value we are assigning
    @track totalPage = 0; //total number of page is needed to display all records
    @track totalRecountCount =0;
    @track isPrev = true;
    @track isNext = true;
    @track isFirst = true;
    @track isEnd = true;
    @track currentPage = 1;
    memberdata = [];

    
   @api loaddata(message){
        this.totaldata =  message;
        if(this.totaldata.length > 0){
            this.startingRecord = 1;
            this.totalRecountCount = this.totaldata.length;
            this.isPrev = true;
            this.isFirst = true;
            this.currentPage = 1;
            if( (this.totalRecountCount / this.pageSize) > 1){
                this.isEnd = false;
                this.isNext = false;
                this.endingRecord = this.pageSize;
                this.totalPage = Math.ceil( this.totalRecountCount / this.pageSize ) ;
                
            }
            else{
                this.isEnd = true;
                this.isNext = true;
                this.endingRecord = this.totalRecountCount;
                this.totalPage = 1;
            }
            this.memberdata = this.totaldata.slice(this.startingRecord-1,this.endingRecord);
        }
        else{
            this.memberdata = [];
        }
        this.dispatchEvent(new CustomEvent("datashow", { detail: this.memberdata }));
    }

    
    //handle First
    handleFirst(){
        this.isNext = false;
        this.isEnd = false;
        this.endingRecord= this.pageSize;
        this.currentPage = 1;
        this.startingRecord = 1;
        this.isPrev= true;
        this.isFirst=true;
        this.memberdata = this.totaldata.slice(this.startingRecord-1, this.endingRecord);
        this.dispatchEvent(new CustomEvent("datashow", { detail: this.memberdata }));
    }
    
    //handle End
    handleEnd(){
        this.isNext = true;
        this.isEnd = true;
        this.endingRecord = this.totalRecountCount;
        this.currentPage = this.totalPage;
        this.startingRecord = (this.totalPage-1)*this.pageSize+1;
        this.isPrev = false;
        this.isFirst = false;
        this.memberdata = this.totaldata.slice(this.startingRecord-1, this.endingRecord);
        this.dispatchEvent(new CustomEvent("datashow", { detail: this.memberdata }));
    }

    //handle next
    handleNext(){
        this.currentPage = this.currentPage+1;
        if(this.currentPage == this.totalPage)
            {
                this.isNext = true;
                this.isEnd = true;
                this.startingRecord = (this.page - 1) * this.pageSize + 1;
                this.endingRecord = this.totalRecountCount;
            }
            else{
                this.isFirst = true;
                this.isPrev = true;
                this.startingRecord = (this.currentPage - 1) * this.pageSize + 1;
                this.endingRecord = this.currentPage * this.pageSize;
            }
                this.isFirst = false;
                this.isPrev = false;
                this.memberdata = this.totaldata.slice( this.startingRecord - 1, this.endingRecord);
                this.dispatchEvent( new CustomEvent("datashow", { detail: this.memberdata })); 
        
    }
 
    //handle prev
    handlePrev(){
        this.currentPage = this.currentPage -1;
        if(this.currentPage == 1)
            {
                this.isFirst = true;
                this.isPrev = true;
                this.startingRecord = 1;
                this.endingRecord = this.pageSize;
            }
            else{
                this.isFirst = false;
                this.isPrev = false;
                this.startingRecord = (this.currentPage - 1) * this.pageSize + 1;
                this.endingRecord = this.currentPage * this.pageSize;
            }
                this.isNext = false;
                this.isEnd = false;
                this.memberdata = this.totaldata.slice(this.startingRecord - 1, this.endingRecord);
                this.dispatchEvent(new CustomEvent("datashow", { detail: this.memberdata }));       
    }

    
    
 
    
}