import { LightningElement,track, api } from 'lwc';
import Id from '@salesforce/schema/Team_Member__c.Id';
import Name from '@salesforce/schema/Team_Member__c.Name';
import Skills__c from '@salesforce/schema/Team_Member__c.Skills__c';
import Team__c from '@salesforce/schema/Team_Member__c.Team__c';

import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { updateRecord } from 'lightning/uiRecordApi';

export default class ModalDemoInLWC extends LightningElement {
    @track value;
    @track name='';
    @track skills='';
    @track teamsdetail=[];
    recordId;
    @track isShowModel = false;

    @api loaddata(message){
        this.isShowModel = true;
        this.teamsdetail = message.teamList;
        this.recordId = message.selectedRecord.Id;
        this.value = message.selectedRecord.TeamId;
        this.name = message.selectedRecord.Name;
        this.skills = message.selectedRecord.Skills__c;
    }

    get getOptions() {
        let teams = [];
        this.teamsdetail.forEach(element => {
            teams.push({
                label: element.Name,
                value: element.Id
            })
        });
        return teams;
    }

    configurationChangeVal(event){
                  
        if(event.target.label == 'Team'){
            this.value = event.target.value;   
        }
         
    }

    hideModalBox() { 
        this.isShowModel = false;
    }

    handleClick(){
        const fields = {};
        fields[Id.fieldApiName] = this.recordId;
        fields[Name.fieldApiName] = this.template.querySelector("[data-field='Name']").value;
        fields[Skills__c.fieldApiName] = this.template.querySelector("[data-field='Skills']").value;
        fields[Team__c.fieldApiName] = this.value;
        const recordInput = {fields};
        updateRecord(recordInput)
            .then(() => {
                this.isShowModel = false;
                this.dispatchEvent( new ShowToastEvent({ title: 'Success', message: 'Update Record Successfully', variant: 'success' }));
                this.dispatchEvent(new CustomEvent("datarefresh", { detail: true }));

            })
            .catch(error => {
                console.log(error)
                this.isShowModel = false;
                this.dispatchEvent( new ShowToastEvent({ title: 'Error In Updating', message: error.body.message, variant: 'error' }));
             });
    }
}