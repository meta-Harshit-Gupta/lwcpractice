public with sharing class lwcController {
    
    @AuraEnabled(cacheable=true)
    public static List<Team__c> team(){
        List <Team__c> team = new List<Team__c>();
        try {

            team = [Select Id, Name from Team__c  LIMIT 10000];
            return team;
            
        } catch (Exception e) {
            return team;
        }
    }

    @AuraEnabled(cacheable = true)
    public static List<Team_Member__c> teamMember(String TeamId){
        
        List <Team_Member__c> teamMember = new List<Team_Member__c>();
        try {
            String query ='SELECT Id, Name, Skills__c, Team__c, Team__r.Name From Team_Member__c ';
            if(!String.isBlank(TeamId)){
                query = query + 'WHERE Team__c = \''+ TeamId + '\' ';
            }
            query = query + '  LIMIT 10000 ';
            teamMember = database.query(query);
            System.debug(query);
            return teamMember;
        } catch (Exception e) {
            return teamMember;
        }
    }
}