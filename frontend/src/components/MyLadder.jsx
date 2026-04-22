import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/auth';
import { MoreHorizontal, ExternalLink, Calendar, MapPin, Building2, Sparkles } from 'lucide-react';
import LadderHeader from './LadderHeader';
import AIGapAnalysis from './AIGapAnalysis';

const COLUMNS = [
  { id: 'saved', label: 'Interested', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
  { id: 'applied', label: 'Applied', bgColor: 'bg-purple-50', borderColor: 'border-purple-200' },
  { id: 'interviewing', label: 'In Progress', bgColor: 'bg-amber-50', borderColor: 'border-amber-200' },
  { id: 'completed', label: 'Outcome', bgColor: 'bg-green-50', borderColor: 'border-green-200' }
];

export default function MyLadder({ session }) {
  const [ladderItems, setLadderItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeOpportunity, setActiveOpportunity] = useState(null);
  
  // Get resume from local storage for AI Analysis
  const resumeText = localStorage.getItem('career_ladder_resume');

  // Fetch ladder items joined with opportunities
  const fetchLadder = async () => {
    try {
      const { data, error } = await supabase
        .from('user_ladder')
        .select(`
          id,
          status,
          notes,
          opportunity_id,
          opportunities (
            id,
            title,
            organization,
            category,
            opportunity_link,
            deadline
          )
        `)
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLadderItems(data || []);
    } catch (err) {
      console.error('Error fetching ladder:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.id) fetchLadder();
  }, [session]);

  const handleStatusChange = async (itemId, newStatus) => {
    // Optimistic UI update
    setLadderItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, status: newStatus } : item
    ));

    try {
      const { error } = await supabase
        .from('user_ladder')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', itemId);

      if (error) {
        throw error;
      }
    } catch (err) {
      console.error('Error updating status:', err.message);
      // Revert on failure by re-fetching
      fetchLadder();
    }
  };

  // Kanban Card Component
  const LadderCard = ({ item }) => {
    const opp = item.opportunities;
    if (!opp) return null;

    return (
      <div 
        onClick={() => setActiveOpportunity(opp)}
        className={`bg-white p-4 rounded-xl border transition-all group relative flex flex-col gap-3 cursor-pointer ${
          activeOpportunity?.id === opp.id 
            ? 'border-indigo-500 shadow-md ring-2 ring-indigo-500/20' 
            : 'border-gray-200 shadow-sm hover:shadow-md hover:border-indigo-300'
        }`}
      >
        
        {/* Status Dropdown */}
        <div className="absolute top-3 right-3 opacity-50 group-hover:opacity-100 transition-opacity z-20">
          <div className="relative group/dropdown" onClick={(e) => e.stopPropagation()}>
            <button className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-md">
              <MoreHorizontal className="w-5 h-5" />
            </button>
            <div className="absolute right-0 top-full mt-1 w-36 bg-white border border-gray-200 shadow-xl rounded-lg py-1 hidden group-hover/dropdown:block z-50">
              {COLUMNS.map(col => (
                <button
                  key={col.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStatusChange(item.id, col.id);
                  }}
                  disabled={item.status === col.id}
                  className={`w-full text-left px-3 py-2 text-xs font-medium transition-colors ${
                    item.status === col.id ? 'text-indigo-600 bg-indigo-50' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Move to {col.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="pr-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-md uppercase tracking-wider">
              {opp.category}
            </span>
            {resumeText && (
              <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-1 rounded-md flex items-center gap-1 group-hover:bg-indigo-100 transition-colors">
                <Sparkles className="w-3 h-3" /> AI Gap
              </span>
            )}
          </div>
          <h4 className="font-bold text-gray-900 text-sm leading-tight line-clamp-2">
            {opp.title}
          </h4>
        </div>
        
        <div className="flex flex-col gap-1 mt-auto pt-2">
          <div className="flex items-center text-xs text-gray-500 font-medium">
            <Building2 className="w-3.5 h-3.5 mr-1.5 shrink-0" />
            <span className="truncate">{opp.organization}</span>
          </div>
          <div className="flex items-center text-xs text-gray-400">
            <Calendar className="w-3.5 h-3.5 mr-1.5 shrink-0" />
            <span className="truncate">{opp.deadline || 'Remote'}</span>
          </div>
        </div>

        {/* Link */}
        <a 
          href={opp.opportunity_link} 
          target="_blank" 
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="mt-2 flex items-center justify-center gap-1.5 w-full py-1.5 text-xs font-bold text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors border border-transparent hover:border-indigo-100"
        >
          View Role <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500 animate-pulse font-medium">Loading your ladder...</div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col max-w-7xl mx-auto w-full">
      <div className="mb-4">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
          My Ladder
        </h1>
        <p className="text-gray-500 text-sm font-medium">
          Track your progress across saved opportunities.
        </p>
      </div>

      <LadderHeader ladderItems={ladderItems} />

      {/* Main Content Area */}
      <div className="flex-1 flex gap-6 min-h-0 overflow-hidden relative">
        
        {/* Kanban Board */}
        <div className="flex-1 flex gap-6 overflow-x-auto pb-4 custom-scrollbar">
          {COLUMNS.map(column => {
            const columnItems = ladderItems.filter(item => item.status === column.id);

            return (
              <div key={column.id} className="flex-1 min-w-[280px] max-w-xs flex flex-col h-full shrink-0">
                {/* Column Header */}
                <div className={`px-4 py-3 rounded-t-xl border-t-4 ${column.borderColor} ${column.bgColor} mb-4 shadow-sm shrink-0`}>
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-gray-900 text-sm">{column.label}</h3>
                    <span className="bg-white text-gray-600 text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
                      {columnItems.length}
                    </span>
                  </div>
                </div>

                {/* Column Content */}
                <div className="flex-1 bg-gray-50/50 rounded-xl border border-gray-100 p-3 overflow-y-auto space-y-3 custom-scrollbar">
                  {columnItems.length === 0 ? (
                    <div className="h-24 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center text-gray-400 text-sm font-medium">
                      No tasks yet
                    </div>
                  ) : (
                    columnItems.map(item => <LadderCard key={item.id} item={item} />)
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* AI Gap Analysis Sidebar */}
        {activeOpportunity && (
          <div className="w-[350px] shrink-0 h-[calc(100%-1rem)] animate-in slide-in-from-right-8 duration-300">
            <AIGapAnalysis 
              opportunity={activeOpportunity} 
              resumeText={resumeText} 
              onClose={() => setActiveOpportunity(null)} 
            />
          </div>
        )}
      </div>
    </div>
  );
}
