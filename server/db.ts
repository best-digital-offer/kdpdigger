import { createClient } from '@supabase/supabase-js';
import type { User, PricingPlan, SavedResearchItem, ResearchHistoryItem, UsageLog, SystemSettings } from '../src/types.ts';

const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be configured on the server.');
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false }
});

const defaultSettings: SystemSettings = {
  geminiConfigured: !!process.env.GEMINI_API_KEY,
  amazonDataProvider: 'autocomplete_public',
  paymentProvider: 'simulation',
  freeCreditsOnSignup: 3,
  rateLimitPerMinute: 30,
  maintenanceMode: false
};

const mapUser = (r: any): User => ({
  id: r.id, email: r.email, name: r.name, role: r.role, credits: r.credits,
  plan: r.plan, planExpiresAt: r.plan_expires_at, createdAt: r.created_at, lastActive: r.last_active
});

const mapPlan = (r: any): PricingPlan => ({
  id:r.id,name:r.name,price:Number(r.price),durationDays:r.duration_days,durationLabel:r.duration_label,
  credits:r.credits,popular:r.popular,recommended:r.recommended,features:r.features || [],description:r.description
});

const mapReport = (r: any): SavedResearchItem => ({
  id:r.id,userId:r.user_id,topic:r.topic,type:r.type,createdAt:r.created_at,
  opportunitiesCount:r.opportunities_count,reportData:r.report_data,notes:r.notes,favorite:r.favorite
});

export class Database {
  async getUsers(): Promise<User[]> {
    const { data, error } = await supabase.from('profiles').select('*').order('created_at',{ascending:false});
    if (error) throw error; return (data || []).map(mapUser);
  }

  async getUserById(id:string): Promise<User|undefined> {
    const { data, error } = await supabase.from('profiles').select('*').eq('id',id).maybeSingle();
    if (error) throw error; return data ? mapUser(data) : undefined;
  }

  async getUserByEmail(email:string): Promise<User|undefined> {
    const { data, error } = await supabase.from('profiles').select('*').ilike('email',email.trim()).maybeSingle();
    if (error) throw error; return data ? mapUser(data) : undefined;
  }

  async createUser(email:string,name?:string,authUserId?:string,role:User['role']='user'):Promise<User> {
    if (!authUserId) throw new Error('A Supabase Auth user ID is required.');
    const { data, error } = await supabase.from('profiles').insert({
      id:authUserId,email:email.trim().toLowerCase(),name:name?.trim() || email.split('@')[0],
      role,credits:defaultSettings.freeCreditsOnSignup,plan:'Free Trial'
    }).select('*').single();
    if (error) throw error; return mapUser(data);
  }

  async updateUser(id:string,updates:Partial<User>):Promise<User|undefined> {
    const patch:any={last_active:new Date().toISOString()};
    if(updates.email!==undefined) patch.email=updates.email;
    if(updates.name!==undefined) patch.name=updates.name;
    if(updates.role!==undefined) patch.role=updates.role;
    if(updates.credits!==undefined) patch.credits=updates.credits;
    if(updates.plan!==undefined) patch.plan=updates.plan;
    if(updates.planExpiresAt!==undefined) patch.plan_expires_at=updates.planExpiresAt;
    const {data,error}=await supabase.from('profiles').update(patch).eq('id',id).select('*').maybeSingle();
    if(error) throw error; return data?mapUser(data):undefined;
  }

  async deductUserCredit(userId:string,amount=1) {
    try {
      const {data,error}=await supabase.rpc('deduct_credit',{p_user_id:userId,p_amount:amount});
      if(error) {
        if(error.message.includes('Insufficient')) return {success:false,creditsRemaining:(await this.getUserById(userId))?.credits || 0,message:'Insufficient research credits. Please top up or upgrade plan.'};
        throw error;
      }
      const user=await this.getUserById(userId);
      return {success:true,creditsRemaining:user?.role==='admin'?999:Number(data),message:undefined};
    } catch(error:any) {
      return {success:false,creditsRemaining:0,message:error.message || 'Unable to update credits.'};
    }
  }

  async addUserCredits(userId:string,amount:number,planName?:string,durationDays?:number):Promise<User|undefined> {
    const user=await this.getUserById(userId); if(!user)return undefined;
    const expires=durationDays?new Date(Date.now()+durationDays*86400000).toISOString():user.planExpiresAt;
    return this.updateUser(userId,{credits:user.credits+amount,plan:planName||user.plan,planExpiresAt:expires});
  }

  async getPlans():Promise<PricingPlan[]> {
    const {data,error}=await supabase.from('pricing_plans').select('*').order('price');
    if(error)throw error; return (data||[]).map(mapPlan);
  }

  async updatePlan(id:string,updates:Partial<PricingPlan>):Promise<PricingPlan|undefined> {
    const patch:any={};
    if(updates.name!==undefined)patch.name=updates.name;
    if(updates.price!==undefined)patch.price=updates.price;
    if(updates.durationDays!==undefined)patch.duration_days=updates.durationDays;
    if(updates.durationLabel!==undefined)patch.duration_label=updates.durationLabel;
    if(updates.credits!==undefined)patch.credits=updates.credits;
    if(updates.popular!==undefined)patch.popular=updates.popular;
    if(updates.recommended!==undefined)patch.recommended=updates.recommended;
    if(updates.features!==undefined)patch.features=updates.features;
    if(updates.description!==undefined)patch.description=updates.description;
    const {data,error}=await supabase.from('pricing_plans').update(patch).eq('id',id).select('*').maybeSingle();
    if(error)throw error; return data?mapPlan(data):undefined;
  }

  async getSavedReports(userId:string):Promise<SavedResearchItem[]> {
    const {data,error}=await supabase.from('saved_reports').select('*').eq('user_id',userId).order('created_at',{ascending:false});
    if(error)throw error; return (data||[]).map(mapReport);
  }

  async getSavedReportById(id:string,userId?:string):Promise<SavedResearchItem|undefined> {
    let q=supabase.from('saved_reports').select('*').eq('id',id); if(userId)q=q.eq('user_id',userId);
    const {data,error}=await q.maybeSingle(); if(error)throw error; return data?mapReport(data):undefined;
  }

  async saveReport(userId:string,topic:string,type:SavedResearchItem['type'],reportData:any,notes?:string):Promise<SavedResearchItem> {
    const {data,error}=await supabase.from('saved_reports').insert({
      user_id:userId,topic,type,opportunities_count:reportData?.opportunities?.length||0,report_data:reportData,notes
    }).select('*').single(); if(error)throw error; return mapReport(data);
  }

  async toggleFavoriteReport(id:string,userId:string):Promise<boolean> {
    const report=await this.getSavedReportById(id,userId); if(!report)throw new Error('Report not found.');
    const {data,error}=await supabase.from('saved_reports').update({favorite:!report.favorite}).eq('id',id).eq('user_id',userId).select('favorite').single();
    if(error)throw error; return data.favorite;
  }

  async deleteSavedReport(id:string,userId:string):Promise<boolean> {
    const {data,error}=await supabase.from('saved_reports').delete().eq('id',id).eq('user_id',userId).select('id');
    if(error)throw error; return (data||[]).length>0;
  }

  async addHistory(userId:string,topic:string,type:string,reportId?:string):Promise<ResearchHistoryItem> {
    const {data,error}=await supabase.from('research_history').insert({user_id:userId,topic,type,report_id:reportId||null}).select('*').single();
    if(error)throw error; return {id:data.id,userId:data.user_id,topic:data.topic,type:data.type,createdAt:data.created_at,reportId:data.report_id};
  }

  async getHistory(userId:string,limit=20):Promise<ResearchHistoryItem[]> {
    const {data,error}=await supabase.from('research_history').select('*').eq('user_id',userId).order('created_at',{ascending:false}).limit(limit);
    if(error)throw error; return (data||[]).map((r:any)=>({id:r.id,userId:r.user_id,topic:r.topic,type:r.type,createdAt:r.created_at,reportId:r.report_id}));
  }

  async logUsage(userId:string,userEmail:string,query:string,researchType:string,creditsUsed:number,cacheHit:boolean):Promise<void> {
    const {error}=await supabase.from('usage_logs').insert({user_id:userId,user_email:userEmail,query,research_type:researchType,credits_used:creditsUsed,cache_hit:cacheHit});
    if(error)throw error;
  }

  async getUsageLogs(limit=50):Promise<UsageLog[]> {
    const {data,error}=await supabase.from('usage_logs').select('*').order('timestamp',{ascending:false}).limit(limit);
    if(error)throw error; return (data||[]).map((r:any)=>({id:r.id,userId:r.user_id,userEmail:r.user_email,query:r.query,researchType:r.research_type,creditsUsed:r.credits_used,timestamp:r.timestamp,cacheHit:r.cache_hit}));
  }

  async getAdminStats() {
    const users=await this.getUsers(), logs=await this.getUsageLogs(10000), history=await this.getHistoryForAdmin();
    const now=Date.now(), day=86400000;
    const newUsersToday=users.filter(u=>now-new Date(u.createdAt).getTime()<day).length;
    const activeUsersToday=users.filter(u=>now-new Date(u.lastActive||u.createdAt).getTime()<day).length;
    const topicCounts:Record<string,number>={}; history.forEach(h=>{const t=(h.topic||'general').toLowerCase().trim();topicCounts[t]=(topicCounts[t]||0)+1;});
    const topTopics=Object.entries(topicCounts).map(([topic,count])=>({topic,count})).sort((a,b)=>b.count-a.count).slice(0,8);
    const paidUsers=users.filter(u=>u.plan!=='Free Trial').length;
    return {totalUsers:users.length,newUsersToday,activeUsersToday,totalResearchRequests:history.length,aiRequestsCount:logs.filter(l=>!l.cacheHit).length,creditsConsumedTotal:logs.reduce((a,l)=>a+l.creditsUsed,0),estimatedRevenue:paidUsers*2,conversionRate:users.length?((paidUsers/users.length)*100).toFixed(1)+'%':'0%',topTopics};
  }

  private async getHistoryForAdmin():Promise<ResearchHistoryItem[]> {
    const {data,error}=await supabase.from('research_history').select('*').order('created_at',{ascending:false}).limit(10000);
    if(error)throw error; return (data||[]).map((r:any)=>({id:r.id,userId:r.user_id,topic:r.topic,type:r.type,createdAt:r.created_at,reportId:r.report_id}));
  }

  async getSettings():Promise<SystemSettings> {
    const {data,error}=await supabase.from('system_settings').select('*').eq('id',true).single();
    if(error)throw error;
    return {...defaultSettings,geminiConfigured:!!process.env.GEMINI_API_KEY,amazonDataProvider:data.amazon_data_provider,paymentProvider:data.payment_provider,freeCreditsOnSignup:data.free_credits_on_signup,rateLimitPerMinute:data.rate_limit_per_minute,maintenanceMode:data.maintenance_mode,geminiEnabled:data.gemini_enabled,groqEnabled:data.groq_enabled};
  }

  async updateSettings(updates:Partial<SystemSettings>):Promise<SystemSettings> {
    const patch:any={};
    if(updates.amazonDataProvider!==undefined)patch.amazon_data_provider=updates.amazonDataProvider;
    if(updates.paymentProvider!==undefined)patch.payment_provider=updates.paymentProvider;
    if(updates.freeCreditsOnSignup!==undefined)patch.free_credits_on_signup=updates.freeCreditsOnSignup;
    if(updates.rateLimitPerMinute!==undefined)patch.rate_limit_per_minute=updates.rateLimitPerMinute;
    if(updates.maintenanceMode!==undefined)patch.maintenance_mode=updates.maintenanceMode;
    if(updates.geminiEnabled!==undefined)patch.gemini_enabled=updates.geminiEnabled;
    if(updates.groqEnabled!==undefined)patch.groq_enabled=updates.groqEnabled;
    const {error}=await supabase.from('system_settings').update(patch).eq('id',true); if(error)throw error;
    return this.getSettings();
  }
}
export const db=new Database();
