'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/date-picker';
import { format } from 'date-fns';
import { WebIcon, AndroidIcon, EligibleIcon, IneligibleIcon, TrashIcon, ChevronDownIcon, CloseIcon } from '@/components/icons';

interface Asset {
  type: 'WEB' | 'MOBILE';
  identifier: string;
  description: string;
  bountyEligibility: 'ELIGIBLE' | 'INELIGIBLE';
}

interface Program {
  name: string;
  startDate: string;
  website: string;
  twitter: string;
  assets: Asset[];
}

interface CreateProgramModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (program: Program) => void;
}

export function CreateProgramModal({ open, onOpenChange, onSubmit }: CreateProgramModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    startDate: new Date(),
    website: '',
    twitter: '',
  });

  const [currentAsset, setCurrentAsset] = useState({
    type: '' as 'WEB' | 'MOBILE' | '',
    identifier: '',
    description: '',
    bountyEligibility: '' as 'ELIGIBLE' | 'INELIGIBLE' | '',
  });

  const [assets, setAssets] = useState<Asset[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = (field: string, value: any) => {
    const newErrors = { ...errors };
    
    switch (field) {
      case 'name':
        if (!value?.trim()) {
          newErrors.name = 'Program name is required';
        } else if (value.trim().length < 3) {
          newErrors.name = 'Program name must be at least 3 characters';
        } else if (value.trim().length > 100) {
          newErrors.name = 'Program name must be less than 100 characters';
        } else {
          delete newErrors.name;
        }
        break;
      case 'website':
        if (value && value.trim()) {
          const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
          if (!urlPattern.test(value.trim())) {
            newErrors.website = 'Please enter a valid website URL';
          } else {
            delete newErrors.website;
          }
        } else {
          delete newErrors.website;
        }
        break;
      case 'twitter':
        if (value && value.trim()) {
          const twitterPattern = /^@?[A-Za-z0-9_]{1,15}$/;
          if (!twitterPattern.test(value.trim())) {
            newErrors.twitter = 'Please enter a valid Twitter username';
          } else {
            delete newErrors.twitter;
          }
        } else {
          delete newErrors.twitter;
        }
        break;
      case 'assetType':
        if (!value) {
          newErrors.assetType = 'Asset type is required';
        } else {
          delete newErrors.assetType;
        }
        break;
      case 'identifier':
        if (!value?.trim()) {
          newErrors.identifier = 'Asset identifier is required';
        } else if (value.trim().length < 2) {
          newErrors.identifier = 'Asset identifier must be at least 2 characters';
        } else if (assets.some(asset => asset.identifier.toLowerCase() === value.trim().toLowerCase())) {
          newErrors.identifier = 'Asset identifier already exists';
        } else {
          delete newErrors.identifier;
        }
        break;
      case 'description':
        if (!value?.trim()) {
          newErrors.description = 'Description is required';
        } else if (value.trim().length < 5) {
          newErrors.description = 'Description must be at least 5 characters';
        } else if (value.trim().length > 200) {
          newErrors.description = 'Description must be less than 200 characters';
        } else {
          delete newErrors.description;
        }
        break;
      case 'bountyEligibility':
        if (!value) {
          newErrors.bountyEligibility = 'Bounty eligibility is required';
        } else {
          delete newErrors.bountyEligibility;
        }
        break;
    }
    
    setErrors(newErrors);
    return !newErrors[field];
  };

  const handleInputChange = (field: string, value: any) => {
    if (field.startsWith('asset.')) {
      const assetField = field.replace('asset.', '');
      setCurrentAsset(prev => ({ ...prev, [assetField]: value }));
      validateField(assetField, value);
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
      validateField(field, value);
    }
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const validateForm = () => {
    const fields = ['name'];
    let isValid = true;
    
    fields.forEach(field => {
      const fieldValue = formData[field as keyof typeof formData];
      if (!validateField(field, fieldValue)) {
        isValid = false;
      }
      setTouched(prev => ({ ...prev, [field]: true }));
    });

    if (assets.length === 0) {
      setErrors(prev => ({ ...prev, assets: 'At least one asset is required' }));
      isValid = false;
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.assets;
        return newErrors;
      });
    }

    return isValid;
  };

  const validateAsset = () => {
    const assetFields = ['assetType', 'identifier', 'description', 'bountyEligibility'];
    let isValid = true;
    
    assetFields.forEach(field => {
      const fieldValue = field === 'assetType' ? currentAsset.type :
                        field === 'identifier' ? currentAsset.identifier :
                        field === 'description' ? currentAsset.description :
                        currentAsset.bountyEligibility;
      
      if (!validateField(field, fieldValue)) {
        isValid = false;
      }
      setTouched(prev => ({ ...prev, [`asset.${field}`]: true }));
    });

    return isValid;
  };

  const handleAddAsset = () => {
    if (!validateAsset()) return;

    setAssets(prev => [...prev, currentAsset as Asset]);
    setCurrentAsset({
      type: '',
      identifier: '',
      description: '',
      bountyEligibility: '',
    });
    
    // Clear asset-related errors and touched states
    const newErrors = { ...errors };
    const newTouched = { ...touched };
    ['assetType', 'identifier', 'description', 'bountyEligibility'].forEach(field => {
      delete newErrors[field];
      delete newTouched[`asset.${field}`];
    });
    setErrors(newErrors);
    setTouched(newTouched);
  };

  const handleDeleteAsset = (index: number) => {
    setAssets(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    onSubmit({
      ...formData,
      startDate: format(formData.startDate, 'MMM dd, yyyy'),
      assets,
    });

    // Reset form
    setFormData({
      name: '',
      startDate: new Date(),
      website: '',
      twitter: '',
    });
    setAssets([]);
    setCurrentAsset({
      type: '',
      identifier: '',
      description: '',
      bountyEligibility: '',
    });
    setErrors({});
    setTouched({});
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      startDate: new Date(),
      website: '',
      twitter: '',
    });
    setAssets([]);
    setCurrentAsset({
      type: '',
      identifier: '',
      description: '',
      bountyEligibility: '',
    });
    setErrors({});
    setTouched({});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        {/* Blurred backdrop */}
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={handleCancel} />
        
        {/* Modal content */}
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-auto max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100 flex-shrink-0">
            <DialogTitle className="text-xl font-bold text-gray-900">Create Program</DialogTitle>
            <button
              onClick={handleCancel}
              className="hover:bg-gray-50 rounded-full p-1 transition-colors duration-200"
            >
              <CloseIcon />
            </button>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-5">
              {/* Program Name and Start Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-900">
                    Program Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    onBlur={() => setTouched(prev => ({ ...prev, name: true }))}
                    className={`border-gray-200 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 rounded-lg h-10 text-sm ${
                      touched.name && errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                    }`}
                    placeholder=""
                  />
                  {touched.name && errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-900">
                    Start Date <span className="text-red-500">*</span>
                  </Label>
                  <DatePicker
                    date={formData.startDate}
                    onDateChange={(date) => setFormData(prev => ({ ...prev, startDate: date || new Date() }))}
                  />
                </div>
              </div>

              {/* Website and Twitter */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-900">Website</Label>
                  <Input
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    onBlur={() => setTouched(prev => ({ ...prev, website: true }))}
                    className={`border-gray-200 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 rounded-lg h-10 text-sm ${
                      touched.website && errors.website ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                    }`}
                    placeholder="Enter Your Website"
                  />
                  {touched.website && errors.website && <p className="text-xs text-red-500">{errors.website}</p>}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-900">Twitter / X</Label>
                  <Input
                    value={formData.twitter}
                    onChange={(e) => handleInputChange('twitter', e.target.value)}
                    onBlur={() => setTouched(prev => ({ ...prev, twitter: true }))}
                    className={`border-gray-200 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 rounded-lg h-10 text-sm ${
                      touched.twitter && errors.twitter ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                    }`}
                    placeholder="Enter @Username"
                  />
                  {touched.twitter && errors.twitter && <p className="text-xs text-red-500">{errors.twitter}</p>}
                </div>
              </div>

              {/* Asset Form */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-900">Asset You Want to Test</Label>
                  <Select 
                    value={currentAsset.type} 
                    onValueChange={(value: 'WEB' | 'MOBILE') => handleInputChange('asset.type', value)}
                  >
                    <SelectTrigger className={`border-gray-200 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 rounded-lg h-10 text-sm ${
                      touched['asset.assetType'] && errors.assetType ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                    }`}>
                      <SelectValue placeholder="Please select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MOBILE">
                        <div className="flex items-center gap-3">
                          <AndroidIcon />
                          <span className="font-medium">Mobile App</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="WEB">
                        <div className="flex items-center gap-3">
                          <WebIcon />
                          <span className="font-medium">Web</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {touched['asset.assetType'] && errors.assetType && <p className="text-xs text-red-500">{errors.assetType}</p>}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-900">Asset Identifier</Label>
                  <Input
                    value={currentAsset.identifier}
                    onChange={(e) => handleInputChange('asset.identifier', e.target.value)}
                    onBlur={() => setTouched(prev => ({ ...prev, 'asset.identifier': true }))}
                    className={`border-gray-200 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 rounded-lg h-10 text-sm ${
                      touched['asset.identifier'] && errors.identifier ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                    }`}
                    placeholder="Write your asset identifier"
                  />
                  {touched['asset.identifier'] && errors.identifier && <p className="text-xs text-red-500">{errors.identifier}</p>}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-900">Description</Label>
                  <Textarea
                    value={currentAsset.description}
                    onChange={(e) => handleInputChange('asset.description', e.target.value)}
                    onBlur={() => setTouched(prev => ({ ...prev, 'asset.description': true }))}
                    className={`border-gray-200 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 rounded-lg h-20 text-sm resize-none ${
                      touched['asset.description'] && errors.description ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                    }`}
                    placeholder="Description"
                  />
                  {touched['asset.description'] && errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
                </div>

                <div className="flex items-end gap-3">
                  <div className="flex-1 space-y-2">
                    <Label className="text-sm font-semibold text-gray-900">Bounty Eligibility</Label>
                    <Select 
                      value={currentAsset.bountyEligibility} 
                      onValueChange={(value: 'ELIGIBLE' | 'INELIGIBLE') => handleInputChange('asset.bountyEligibility', value)}
                    >
                      <SelectTrigger className={`border-gray-200 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 rounded-lg h-10 text-sm ${
                        touched['asset.bountyEligibility'] && errors.bountyEligibility ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                      }`}>
                        <SelectValue placeholder="Please Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ELIGIBLE">
                          <div className="flex items-center gap-2">
                            <EligibleIcon />
                            <span className="font-medium">Eligible</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="INELIGIBLE">
                          <div className="flex items-center gap-2">
                            <IneligibleIcon />
                            <span className="font-medium">Ineligible</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {touched['asset.bountyEligibility'] && errors.bountyEligibility && <p className="text-xs text-red-500">{errors.bountyEligibility}</p>}
                  </div>
                  
                  <Button
                    onClick={handleAddAsset}
                    className="bg-violet-600 hover:bg-violet-700 text-white px-6 h-10 rounded-lg font-semibold transition-all duration-200 text-sm"
                  >
                    Add
                  </Button>
                </div>
              </div>

              {/* Assets Table */}
              {assets.length > 0 && (
                <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="text-left py-2.5 px-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">Type</th>
                          <th className="text-left py-2.5 px-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">Asset Identifier</th>
                          <th className="text-left py-2.5 px-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">Description</th>
                          <th className="text-left py-2.5 px-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">Bounty</th>
                          <th className="w-10 py-2.5 px-3"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {assets.map((asset, index) => (
                          <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                            <td className="py-2.5 px-3">
                              {asset.type === 'WEB' ? <WebIcon /> : <AndroidIcon />}
                            </td>
                            <td className="py-2.5 px-3">
                              <span className="text-violet-600 font-semibold text-sm">{asset.identifier}</span>
                            </td>
                            <td className="py-2.5 px-3 text-gray-800 font-medium text-sm max-w-[120px] truncate">{asset.description}</td>
                            <td className="py-2.5 px-3">
                              <div className="flex items-center gap-1.5">
                                {asset.bountyEligibility === 'ELIGIBLE' ? <EligibleIcon /> : <IneligibleIcon />}
                                <span className={`font-semibold text-xs ${
                                  asset.bountyEligibility === 'ELIGIBLE'
                                    ? 'text-emerald-600'
                                    : 'text-red-600'
                                }`}>
                                  {asset.bountyEligibility === 'ELIGIBLE' ? 'Eligible' : 'Ineligible'}
                                </span>
                              </div>
                            </td>
                            <td className="py-2.5 px-3">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteAsset(index)}
                                className="w-7 h-7 p-0 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors duration-200"
                              >
                                <TrashIcon />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {errors.assets && <p className="text-xs text-red-500">{errors.assets}</p>}
            </div>
          </div>

          {/* Footer - Fixed at bottom */}
          <div className="flex gap-3 p-6 border-t border-gray-100 flex-shrink-0">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="flex-1 h-11 border-gray-200 text-violet-600 hover:bg-violet-50 rounded-lg font-semibold transition-colors duration-200"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={Object.keys(errors).length > 0}
              className="flex-1 h-11 bg-violet-600 hover:bg-violet-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-all duration-200"
            >
              Submit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}