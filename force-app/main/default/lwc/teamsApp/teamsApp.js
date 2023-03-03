import { LightningElement, wire, track } from 'lwc';
import team from '@salesforce/apex/lwcController.team';

export default class TeamsApp extends LightningElement {

    teamsdetail=[];
    @track isLoading=true;

    @wire(team,{})
    teams({data,error}){
        if(data){
            if(data.length > 0){
                this.teamsdetail = data;
                this.isLoading = false;
            }
            
        }else{
            console.log(error);
        }
    }

}