import { LightningElement, api } from 'lwc';

import Name from '@salesforce/schema/Team_Member__c.Name';
import Skills__c from '@salesforce/schema/Team_Member__c.Skills__c';
import Team__c from '@salesforce/schema/Team_Member__c.Team__c';

export default class CompactLayoutOnHover extends LightningElement {
    @api recordId;
    fields = [Name, Skills__c, Team__c];

    handleSuccess(){

        this.dispatchEvent(new CustomEvent("datarefresh", { detail: true }));
    }
}