import { LightningElement, api, track, wire } from 'lwc';
import teamMemberDetail from '@salesforce/apex/lwcController.teamMember';
import { subscribe, MessageContext } from 'lightning/messageService';
import member_insert from '@salesforce/messageChannel/memberInsert__c';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import { refreshApex } from '@salesforce/apex';
import { deleteRecord } from 'lightning/uiRecordApi';

import Id from '@salesforce/schema/Team_Member__c.Id';
import Name from '@salesforce/schema/Team_Member__c.Name';
import Skills__c from '@salesforce/schema/Team_Member__c.Skills__c';
import Team__c from '@salesforce/schema/Team_Member__c.Team__c';

import { updateRecord } from 'lightning/uiRecordApi';

const action = [{ label: 'Edit', name: 'Edit' }];



const columns = [
    { label: 'Name', fieldName: 'Name', type: 'Text',editable:true },
    { label: 'Team', fieldName: 'Teamname', type: 'Text' },
    { label: 'Skills', fieldName: 'Skills__c', type: 'Text',editable:true },
    {type: 'button-icon', typeAttributes: {iconName: 'utility:delete', name: 'delete', iconClass: 'slds-icon-text-error'}},
    {type: 'action', typeAttributes: { rowActions: action, menuAlignment: 'auto' }}

];


export default class TeamsList extends LightningElement {
    @track isLoading = false;
    columns = columns;
    @api teamsdetail;
    @track memberdata = [];
    @track refreshId = null;
    @track isMemberData = true;
    teamMember;
    @track value;
    @track draftValues;

    connectedCallback() {
        this.subscribeToMessageChannel();
    }

    @wire(MessageContext)
    messageContext;

    @wire(teamMemberDetail, { TeamId: '$refreshId' })
    teamMemberDetail(result) {
        if (result.data) {
            this.teamMember = result;
            this.template.querySelector('c-pagination')?.loaddata(this.teamMember.data);
        } else {
            this.teamMember = undefined;
            console.log(result.error);
        }
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

    subscribeToMessageChannel() {
        this.subscription = subscribe(
            this.messageContext,
            member_insert,
            (message) => this.handleMessage(message)
        )
    }


    selectteam(event) {
        this.refreshId = event.detail.value;
    }

    datarefresh(event){
        refreshApex(this.teamMember);
    }


    handleMessage(message) {
        this.value = message['teamId'];
        if (this.refreshId == message['teamId']) {
            refreshApex(this.teamMember);
        }
        else {
            this.refreshId = message['teamId'];
        }
    }

    datashow(event) {
        if (event.detail.length > 0) {
            let result = event.detail;
            this.memberdata = [];
            result.forEach((element) => {
                let data = {
                    Id : element.Id,
                    Name :element.Name ,
                    Teamname : element.Team__r.Name,
                    TeamId : element.Team__c,
                    Skills__c : element.Skills__c,
                }
                this.memberdata.push(data);
            });
        }
        else {
            this.isMemberData = false;
        }
    }

    handleRowAction(event) {
        if(event.detail.action.name == "delete"){
            deleteRecord(event.detail.row.Id)
            .then(() => {
                refreshApex(this.teamMember);
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Record deleted',
                        variant: 'success'
                    })
                );
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error deleting record',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            });
            
        }
        if(event.detail.action.name == "Edit"){
            let data1 = {
                selectedRecord : event.detail.row,
                teamList : this.teamsdetail
            }
            this.template.querySelector('c-modal-demo-in-l-w-c')?.loaddata(data1);
        }
    }


    handleDelete(){
        var el = this.template.querySelector('lightning-datatable');          
        var selected= el.getSelectedRows();
        let Id=[];
        if(selected.length>0){
            selected.forEach((element) => {
                Id.push(element.Id);
            })
            const promises = Id.map(recordId => deleteRecord(recordId)); 
            Promise.all(promises).then(() => {
                refreshApex(this.teamMember);
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Record deleted',
                        variant: 'success'
                    })
                );
            }) .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error deleting record',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            });
            el.selectedRows=[];
        }
        
    }

    handleSave(event){
        this.draftValues = event.detail.draftValues;
        const records = event.detail.draftValues.slice().map((draftValue) => {
            const fields = Object.assign({}, draftValue);
            return { fields };
        });
        const promises = records.map(recordInput => updateRecord(recordInput)); 
            Promise.all(promises).then(() => {
                refreshApex(this.teamMember);
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Record Updated Successfully',
                        variant: 'success'
                    })
                );
            }) .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error deleting record',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            });
            this.draftValues =null;
    }
}