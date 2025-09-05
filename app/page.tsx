'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { CreateProgramModal } from '@/components/create-program-modal';
import { DollarIcon, InfoIcon, ChevronDownIcon, EligibleIcon, IneligibleIcon, MenuIcon, TrashIcon } from '@/components/icons';

interface Program {
  id: string;
  name: string;
  startDate: string;
  assets: {
    type: 'WEB' | 'MOBILE';
    identifier: string;
    description: string;
    bountyEligibility: 'ELIGIBLE' | 'INELIGIBLE';
  }[];
  website: string;
  twitter: string;
}

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  // Load programs from localStorage on mount
  useEffect(() => {
    const savedPrograms = localStorage.getItem('bounty-programs');
    if (savedPrograms) {
      setPrograms(JSON.parse(savedPrograms));
    } else {
      // Default programs if none saved
      const defaultPrograms = [
        {
          id: '1',
          name: 'Web AI Pentest - B2 team',
          startDate: 'Nov02, 2023',
          assets: [
            {
              type: 'WEB' as const,
              identifier: 'Trustline.sa',
              description: 'Complete Form',
              bountyEligibility: 'ELIGIBLE' as const
            }
          ],
          website: 'trustline.sa',
          twitter: '@trustline'
        },
        {
          id: '2', 
          name: 'Web AI Pentest - B2 team',
          startDate: 'Nov02, 2023',
          assets: [
            {
              type: 'WEB' as const,
              identifier: 'Trustline.sa',
              description: 'Under Review',
              bountyEligibility: 'INELIGIBLE' as const
            }
          ],
          website: 'trustline.sa',
          twitter: '@trustline'
        },
        {
          id: '3',
          name: 'Web AI Pentest - B2 team', 
          startDate: 'Nov02, 2023',
          assets: [
            {
              type: 'WEB' as const,
              identifier: 'Trustline.sa',
              description: '5 open Findings',
              bountyEligibility: 'ELIGIBLE' as const
            }
          ],
          website: 'trustline.sa',
          twitter: '@trustline'
        },
        {
          id: '4',
          name: 'Web AI Pentest - B2 team',
          startDate: 'Nov02, 2023', 
          assets: [
            {
              type: 'WEB' as const,
              identifier: 'Trustline.sa',
              description: '74 Resolved Reports',
              bountyEligibility: 'INELIGIBLE' as const
            }
          ],
          website: 'trustline.sa',
          twitter: '@trustline'
        },
        {
          id: '5',
          name: 'Web AI Pentest - B2 team',
          startDate: 'Nov02, 2023',
          assets: [
            {
              type: 'WEB' as const, 
              identifier: 'Trustline.sa',
              description: '71 Resolved Reports',
              bountyEligibility: 'ELIGIBLE' as const
            }
          ],
          website: 'trustline.sa',
          twitter: '@trustline'
        },
        {
          id: '6',
          name: 'Web AI Pentest - B2 team',
          startDate: 'Nov02, 2023',
          assets: [
            {
              type: 'WEB' as const,
              identifier: 'Trustline.sa', 
              description: '71 Resolved Reports',
              bountyEligibility: 'INELIGIBLE' as const
            }
          ],
          website: 'trustline.sa',
          twitter: '@trustline'
        }
      ];
      setPrograms(defaultPrograms);
      localStorage.setItem('bounty-programs', JSON.stringify(defaultPrograms));
    }
  }, []);

  // Save programs to localStorage whenever programs change
  useEffect(() => {
    if (programs.length > 0) {
      localStorage.setItem('bounty-programs', JSON.stringify(programs));
    }
  }, [programs]);

  const handleProgramCreate = (newProgram: Omit<Program, 'id'>) => {
    const program = {
      ...newProgram,
      id: Date.now().toString()
    };
    setPrograms(prev => [...prev, program]);
    setIsCreateModalOpen(false);
  };

  const handleDeleteProgram = (programId: string) => {
    setPrograms(prev => prev.filter(program => program.id !== programId));
  };

  const toggleRowExpansion = (programId: string) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(programId)) {
        newSet.delete(programId);
      } else {
        newSet.add(programId);
      }
      return newSet;
    });
  };

  const renderProgramRows = () => {
    const rows: JSX.Element[] = [];
    
    programs.forEach((program) => {
      const isExpanded = expandedRows.has(program.id);
      
      // First asset row (always shown)
      if (program.assets.length > 0) {
        rows.push(
          <tr key={`${program.id}-0`} className="border-b-2 border-gray-300 hover:bg-gray-50 transition-colors duration-150">
            <td className="py-4 px-6">
              <span className="text-violet-600 font-semibold hover:text-violet-700 cursor-pointer transition-colors duration-150">
                {program.name}
              </span>
            </td>
            <td className="py-4 px-6 text-gray-800 font-medium">{program.startDate}</td>
            <td className="py-4 px-6">
              <span className="text-violet-600 font-semibold hover:text-violet-700 cursor-pointer transition-colors duration-150">
                {program.assets[0].identifier}
              </span>
            </td>
            <td className="py-4 px-6 text-gray-800 font-medium">{program.assets[0].description}</td>
            <td className="py-4 px-6">
              <div className="flex items-center gap-2">
                {program.assets[0].bountyEligibility === 'ELIGIBLE' ? <EligibleIcon /> : <IneligibleIcon />}
                <span className={`font-semibold ${
                  program.assets[0].bountyEligibility === 'ELIGIBLE' 
                    ? 'text-emerald-600' 
                    : 'text-red-600'
                }`}>
                  {program.assets[0].bountyEligibility === 'ELIGIBLE' ? 'Eligible' : 'Ineligible'}
                </span>
              </div>
            </td>
            <td className="py-4 px-6">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="w-8 h-8 p-0 hover:bg-gray-100 rounded-md">
                    <MenuIcon />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem 
                    onClick={() => handleDeleteProgram(program.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                  >
                    <TrashIcon />
                    <span className="ml-2">Delete Program</span>
                  </DropdownMenuItem>
                  {program.assets.length > 1 && (
                    <DropdownMenuItem 
                      onClick={() => toggleRowExpansion(program.id)}
                      className="cursor-pointer"
                    >
                      <span className="ml-2">
                        {isExpanded ? 'Collapse Assets' : `Show All Assets (${program.assets.length})`}
                      </span>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </td>
          </tr>
        );
      }
      
      // Additional asset rows (shown when expanded or if there are multiple assets)
      if (program.assets.length > 1 && isExpanded) {
        program.assets.slice(1).forEach((asset, assetIndex) => {
          rows.push(
            <tr key={`${program.id}-${assetIndex + 1}`} className="border-b-2 border-gray-300 hover:bg-gray-50 transition-colors duration-150">
              <td className="py-4 px-6">
                <span className="text-gray-400 text-sm">↳ {program.name}</span>
              </td>
              <td className="py-4 px-6 text-gray-400 text-sm">{program.startDate}</td>
              <td className="py-4 px-6">
                <span className="text-violet-600 font-semibold hover:text-violet-700 cursor-pointer transition-colors duration-150">
                  {asset.identifier}
                </span>
              </td>
              <td className="py-4 px-6 text-gray-800 font-medium">{asset.description}</td>
              <td className="py-4 px-6">
                <div className="flex items-center gap-2">
                  {asset.bountyEligibility === 'ELIGIBLE' ? <EligibleIcon /> : <IneligibleIcon />}
                  <span className={`font-semibold ${
                    asset.bountyEligibility === 'ELIGIBLE' 
                      ? 'text-emerald-600' 
                      : 'text-red-600'
                  }`}>
                    {asset.bountyEligibility === 'ELIGIBLE' ? 'Eligible' : 'Ineligible'}
                  </span>
                </div>
              </td>
              <td className="py-4 px-6"></td>
            </tr>
          );
        });
      }
    });
    
    return rows;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Programs</h1>
        </div>

        {/* Subscription Details Header */}
        <h2 className="text-xl font-semibold text-gray-900">Subscription Details</h2>

        {/* Subscription Card */}
        <Card className="border-0 shadow-sm bg-white rounded-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-12">
                <div className="flex items-center gap-4">
                  <DollarIcon />
                  <div>
                    <p className="text-xl font-bold text-black">Subscription 01 <span className="text-xs font-alexendria">Ends Aug 23, 2023</span></p>
                  </div>
                </div>
                
                <div className="w-px h-12 bg-gray-400"></div>
                
                <div className="text-center">
                  <div className="flex items-center font-normal gap-1 text-sm text-green-500 mb-1">
                    Available <InfoIcon />
                  </div>
                  <p className="text-xl font-semibold text-emerald-500">8,000 SAR</p>
                </div>
                
                <div className="w-px h-12 bg-gray-400"></div>
                
                <div className="text-center">
                  <div className="flex items-center font-normal gap-1 text-sm text-gray-500 mb-1">
                    Consumed <InfoIcon />
                  </div>
                  <p className="text-xl font-normal text-gray-500">400 SAR</p>
                </div>
                
                <div className="w-px h-12 bg-gray-400"></div>
                
                <div className="text-center">
                  <div className="text-sm text-black-500 font-bold mb-1">Total Balance</div>
                  <p className="text-xl font-semibold text-gray-900">1,200 SAR</p>
                </div>
              </div>

              <Button 
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-violet-100 hover:bg-violet-200 text-[#7B1AFF] px-6 py-2.5 rounded-lg transition-colors duration-200 font-semibold border-0"
              >
                Create Program
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* All Programs Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">All programs</h2>
          
          <Card className="border-0 shadow-sm bg-white rounded-xl">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-300">
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                        <div className="flex items-center gap-2">
                          Program <ChevronDownIcon />
                        </div>
                      </th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                        <div className="flex items-center gap-2">
                          Start Date <ChevronDownIcon />
                        </div>
                      </th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Asset Identifier</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Description</th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Bounty Eligibility</th>
                      <th className="w-12 py-4 px-6"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {renderProgramRows()}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <CreateProgramModal 
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSubmit={handleProgramCreate}
      />
    </div>
  );
}