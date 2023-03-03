import { LightningElement,  api, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import Name from '@salesforce/schema/Team_Member__c.Name';
import Skills__c from '@salesforce/schema/Team_Member__c.Skills__c';
import Team__c from '@salesforce/schema/Team_Member__c.Team__c';

import { createRecord } from 'lightning/uiRecordApi';
import MainObject from '@salesforce/schema/Team_Member__c';


import { publish, MessageContext } from 'lightning/messageService';
import member_insert from '@salesforce/messageChannel/memberInsert__c';


export default class MemberSkills extends LightningElement {
    isLoading = false;
    @api teamsdetail;
    Skills='';
    Name='';
    Team='';

    @wire(MessageContext)
   messageContext;
   

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

        if(event.target.label == 'Name'){
            this.Name = event.target.value ;
        }            
        if(event.target.label == 'Team'){
            this.Team = event.target.value;   
        }
        if(event.target.label == 'Skill'){
            this.Skills = event.target.value; 
        }  
        
    }

    handleClick(){
        this.isLoading=true;
        const fields = {};
        fields[Name.fieldApiName] = this.Name;
        fields[Skills__c.fieldApiName] = this.Skills;
        fields[Team__c.fieldApiName] = this.Team;
        const recordInput = {apiName: MainObject.objectApiName, fields };
        createRecord(recordInput)
            .then(result => {
                const payload={
                    teamId : this.Team
                    }
                publish(this.messageContext, member_insert, payload);
                this.dispatchEvent( new ShowToastEvent({ title: 'Success', message: 'Team Member created successfull', variant: 'success' }));
            })
            .catch(error => {
                this.isLoading = false;
                this.dispatchEvent( new ShowToastEvent({ title: 'Error', message: error.body.message, variant: 'error' }));
            });
            this.isLoading=false;

    }

    
}