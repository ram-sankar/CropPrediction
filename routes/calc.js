var db_access = require('../models/schema');

var calc_total = function(db_ph,ph,ph_max,ph_min,db_n,n,db_p,p,db_k,k,db_ca,ca,db_mg,mg,db_name,temp){
    var t_mark;
    ph_mark = calc_ph(ph_avg,ph,ph_max,ph_min);
    n_mark = calc_n(db_n,n);
    p_mark = calc_p(db_p,p);
    k_mark = calc_k(db_k,k);
    ca_mark = calc_ca(db_ca,ca);
    mg_mark = calc_mg(db_mg,mg);
    ph_mark = Number((ph_mark).toFixed(1));
                                                                        
    t_mark = ph_mark+n_mark+p_mark+k_mark+ca_mark+mg_mark;
    t_mark = Number((t_mark).toFixed(1));
    
    var prediction = new db_access.prediction({crop_mark:t_mark, crop_name: db_name, crop_id:temp, ph_mark:ph_mark, n_mark:n_mark, p_mark:p_mark, k_mark:k_mark, ca_mark:ca_mark, mg_mark:mg_mark});
    
    db_access.prediction.create(prediction, function(err, newUser) {
    if(err) return next(err);                           
    });
        
    return t_mark;
}



var calc_ph = function(db_ph,ph,ph_max,ph_min){
    
        var x,temp_mark,j=0,ph,flag=0;    
        if(!(ph>=3.5&&ph<=8.5) || (ph<=(ph_avg-2)) || (ph>=(ph_avg+2)) )
          return -100;
                   
        for(x=ph_avg-2;x<ph_avg+2;x+=0.04)
        {                    
            temp_mark=j;
            if(ph<=x)
            {
                flag=1;
                break;
            } 
            j++;
        }
    
        if(flag==0)
            return -100;
    
        if(temp_mark>50)
            temp_mark = (100-temp_mark);
    
        temp_mark = temp_mark/5;    
        temp_mark = (temp_mark/10)*7;
    
        if( (ph_min<=ph) && (ph<=ph_max) )
            temp_mark+=3;
        return temp_mark;
}


var calc_n = function(db_n,n){
    
        var x,temp_mark,j=0,n,flag=0;
        if(!(n>=80&&n<=240))
          return -100;
    
        if(n<=db_n-30)
            return -100
    
        for(x=db_n-30;x<=db_n+30;x+=0.6)
        {
            temp_mark = j;
            if(n<=x)
            {
                flag=1;
                break;
            } 
            j++;
        }
    
        if(flag==0)
            return -100;
        
        if(temp_mark>50)
            temp_mark = (100-temp_mark);

        temp_mark = temp_mark/5;
        return temp_mark;
}


var calc_p = function(db_p,p){
    
        var x,temp_mark,j=0,p,flag=0;        
        if(!(p>=5&&p<=90))
          return -100;
        if(p<=db_p-25)
            return -100
        for(x=db_p-25;x<=db_p+25;x+=0.5)
        {
            temp_mark = j;
            if(p<=x)
            {
                flag=1;
                break;
            } 
            j++;
        }
    
        if(flag==0)
            return -100;

        if(temp_mark>50)
            temp_mark = (100-temp_mark);

        temp_mark = temp_mark/5;
         return temp_mark;
}


var calc_k = function(db_k,k){
    
        var x,temp_mark,j=0,k,flag=0;        
        if(!(k>=15&&k<=280))
          return -100;
    
        if(k<=db_k-50)
            return -100
    
        for(x=db_k-50;x<=db_k+50;x+=1)
        {            
            temp_mark = j;
            if(k<=x)
            {
                flag=1;
                break;
            } 
            j++;
        }

        if(flag==0)
            return -100;
    
        if(temp_mark>50)
            temp_mark = (100-temp_mark);

        temp_mark = temp_mark/5;
        return temp_mark;
}





var calc_ca = function(db_ca,ca){
    
        var x,temp_mark,j=0,ca,flag=0;        
        if(!(ca>=0&&ca<=280))
          return -100;
    
        if(ca<=db_ca-30)
            return -100
    
        for(x=db_ca-30;x<=db_ca+30;x+=0.6)
        {
            temp_mark = j;
            if(ca<=x)
            {
                flag=1;
                break;
            }    
            j++;
        }

        if(flag==0)
            return -100;
        if(temp_mark>50)
            temp_mark = (100-temp_mark);

        temp_mark = temp_mark/5;
         return temp_mark;
}



var calc_mg = function(db_mg,mg){
    
        var x,temp_mark,j=0,mg,flag=0;        
        if(!(mg>=5&&mg<=43))
          return -100;
    
        if(mg<=db_mg-20)
            return -100
    
        for(x=db_mg-20;x<=db_mg+20;x+=0.4)
        {
            temp_mark = j;
            if(mg<=x)
            {
                flag=1;
                break;
            } 
            j++;
        }

        if(flag==0)
            return -100;
    
        if(temp_mark>50)
            temp_mark = (100-temp_mark);

        temp_mark = temp_mark/5;
         return temp_mark;
}

module.exports.calc_total = calc_total;