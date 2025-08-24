import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Bell, 
  CreditCard, 
  Shield, 
  Headphones, 
  Gift, 
  Settings, 
  Ticket, 
  LogOut,
  Camera,
  Check,
  ChevronRight,
  ArrowRight
} from "lucide-react";

export default function Profile() {
  const menuItems = [
    {
      icon: Bell,
      label: "Notifications",
      badge: 1,
    },
    {
      icon: CreditCard,
      label: "Balance records",
    },
    {
      icon: Shield,
      label: "Account & Security",
    },
    {
      icon: Headphones,
      label: "Live Support",
    },
    {
      icon: Gift,
      label: "Gifts",
    },
    {
      icon: Settings,
      label: "Settings",
    },
    {
      icon: Ticket,
      label: "Ticket",
    },
    {
      icon: LogOut,
      label: "Logout",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-burgundy-800 to-burgundy-900">
      <div className="max-w-md mx-auto px-4 py-6">
        
        {/* Profile Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gold-400 mb-6">Profile</h1>
          
          {/* Profile Info */}
          <div className="flex items-center space-x-4 mb-6">
            {/* Profile Avatar with Badge */}
            <div className="relative">
              <div className="profile-avatar w-20 h-20 rounded-full p-1 card-shadow">
                <Avatar className="w-full h-full">
                  <AvatarImage 
                    src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face" 
                    alt="Profile Avatar"
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-burgundy-700 text-gold-400 text-lg font-semibold">
                    P7
                  </AvatarFallback>
                </Avatar>
              </div>
              {/* Camera Badge */}
              <div className="absolute -bottom-1 -right-1 bg-gold-500 rounded-full p-1.5">
                <Camera className="w-4 h-4 text-burgundy-900" />
              </div>
            </div>
            
            {/* Player Info */}
            <div className="flex-1 text-left">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-lg font-semibold text-white">Player74835887</span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
              <div className="text-sm text-gray-400 mb-2">uid:74835887</div>
              <div className="text-lg font-bold text-gold-400">₹0</div>
            </div>
          </div>
        </div>
        
        {/* Upgrade Card */}
        <div className="upgrade-card rounded-2xl p-4 mb-6 card-shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* VIP Badge */}
              <div className="bg-white/20 rounded-lg p-2">
                <div className="text-center">
                  <div className="text-xs font-medium text-burgundy-900">V</div>
                  <div className="text-lg font-bold text-burgundy-900">V0</div>
                </div>
              </div>
              
              {/* Upgrade Info */}
              <div>
                <p className="text-burgundy-900 font-medium text-sm">
                  You need <span className="font-bold">100</span> to upgrade to
                </p>
                <p className="text-burgundy-900 font-bold">V1</p>
              </div>
            </div>
            
            {/* Arrow */}
            <ArrowRight className="w-8 h-8 text-burgundy-900" />
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-burgundy-900 font-medium mb-1">
              <span>V0</span>
              <span>V1</span>
            </div>
            <div className="bg-burgundy-900/30 rounded-full h-2">
              <div className="bg-burgundy-900 h-2 rounded-full w-0"></div>
            </div>
            <div className="text-center text-burgundy-900 font-medium text-sm mt-1">0/100</div>
          </div>
        </div>
        
        {/* Menu Section */}
        <div className="space-y-2">
          {menuItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div
                key={index}
                className="menu-item flex items-center justify-between bg-burgundy-800/50 rounded-xl p-4 cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <IconComponent className="w-6 h-6 text-gold-400" />
                  <span className="text-white font-medium">{item.label}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {item.badge && (
                    <Badge className="bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5 min-w-[20px] text-center border-0">
                      {item.badge}
                    </Badge>
                  )}
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            );
          })}
        </div>
        
      </div>
    </div>
  );
}
