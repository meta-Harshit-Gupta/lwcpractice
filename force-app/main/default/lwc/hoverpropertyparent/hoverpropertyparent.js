import { LightningElement ,api } from 'lwc';
import Name from '@salesforce/schema/Team_Member__c.Name';
import Skills__c from '@salesforce/schema/Team_Member__c.Skills__c';
import Team__c from '@salesforce/schema/Team_Member__c.Team__c';

export default class Hoverpropertyparent extends LightningElement {
    @api record;
    name = Name;
    skill = Skills__c;
    team = Team__c;

    handleMouseover(event) {
        const toolTipDiv = this.template.querySelector('div.ModelTooltip');
        toolTipDiv.style.opacity = 1;
        toolTipDiv.style.display = "block";
        // eslint-disable-next-line
        window.clearTimeout(this.delayTimeout);
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        this.delayTimeout = setTimeout(() => {
            this.objRecordId = this.recordId;
        }, 50);
    }

    /* Handle Mouse Out*/
    handleMouseout() {
        const toolTipDiv = this.template.querySelector('div.ModelTooltip');
        toolTipDiv.style.opacity = 0;
        toolTipDiv.style.display = "none";
    }

    datarefresh(event){
        this.dispatchEvent(new CustomEvent("datarefresh", { detail: true }));
    }
}