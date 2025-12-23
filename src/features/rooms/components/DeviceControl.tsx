// import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
// import { Button } from "@/shared/components/ui/button"
// import { Lightbulb, DoorOpen, Power, PowerOff, Lock, Unlock } from "lucide-react"
// import { type RoomDevice } from "../api/RoomService"
// import { useControlLightMutation, useControlDoorMutation } from "@/features/devices/api/DeviceService"
// import { useState } from "react"
// import { Loader2 } from "lucide-react"

// interface DeviceControlProps {
//   devices: RoomDevice[]
// }

// export const DeviceControl = ({ devices }: DeviceControlProps) => {
//   const { mutateAsync: controlLight, isPending: isControllingLight } = useControlLightMutation()
//   const { mutateAsync: controlDoor, isPending: isControllingDoor } = useControlDoorMutation()
  
//   const [lightStates, setLightStates] = useState<Record<string, boolean>>({})
//   const [doorStates, setDoorStates] = useState<Record<string, boolean>>({})

//   const lightDevices = devices.filter(d => d.capabilities?.includes('light'))
//   const doorDevices = devices.filter(d => d.capabilities?.includes('door'))

//   const handleLightControl = async (deviceId: string, state: boolean) => {
//     try {
//       await controlLight({ deviceId, state })
//       setLightStates(prev => ({ ...prev, [deviceId]: state }))
//     } catch (error) {
//       console.error('Failed to control light:', error)
//     }
//   }

//   const handleDoorControl = async (deviceId: string, state: boolean) => {
//     try {
//       await controlDoor({ deviceId, state })
//       setDoorStates(prev => ({ ...prev, [deviceId]: state }))
//     } catch (error) {
//       console.error('Failed to control door:', error)
//     }
//   }

//   if (lightDevices.length === 0 && doorDevices.length === 0) {
//     return null
//   }

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Điều khiển thiết bị</CardTitle>
//       </CardHeader>
//       <CardContent className="space-y-6">
//         {/* Điều khiển đèn */}
//         {lightDevices.length > 0 && (
//           <div>
//             <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
//               <Lightbulb className="w-4 h-4" />
//               Đèn ({lightDevices.length})
//             </h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//               {lightDevices.map((device) => {
//                 const isOn = lightStates[device.id] ?? false
//                 return (
//                   <div
//                     key={device.id}
//                     className="flex items-center justify-between p-3 border rounded-lg"
//                   >
//                     <div>
//                       <p className="font-medium">{device.name}</p>
//                       <p className="text-sm text-muted-foreground">
//                         {device.status === 'online' ? 'Sẵn sàng' : 'Offline'}
//                       </p>
//                     </div>
//                     <div className="flex gap-2">
//                       <Button
//                         size="sm"
//                         variant={isOn ? "default" : "outline"}
//                         onClick={() => handleLightControl(device.id, !isOn)}
//                         disabled={device.status !== 'online' || isControllingLight}
//                       >
//                         {isControllingLight ? (
//                           <Loader2 className="w-4 h-4 animate-spin" />
//                         ) : isOn ? (
//                           <>
//                             <PowerOff className="w-4 h-4 mr-1" />
//                             Tắt
//                           </>
//                         ) : (
//                           <>
//                             <Power className="w-4 h-4 mr-1" />
//                             Bật
//                           </>
//                         )}
//                       </Button>
//                     </div>
//                   </div>
//                 )
//               })}
//             </div>
//           </div>
//         )}

//         {/* Điều khiển cửa */}
//         {doorDevices.length > 0 && (
//           <div>
//             <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
//               <DoorOpen className="w-4 h-4" />
//               Cửa ({doorDevices.length})
//             </h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//               {doorDevices.map((device) => {
//                 const isOpen = doorStates[device.id] ?? false
//                 return (
//                   <div
//                     key={device.id}
//                     className="flex items-center justify-between p-3 border rounded-lg"
//                   >
//                     <div>
//                       <p className="font-medium">{device.name}</p>
//                       <p className="text-sm text-muted-foreground">
//                         {device.status === 'online' ? 'Sẵn sàng' : 'Offline'}
//                       </p>
//                     </div>
//                     <div className="flex gap-2">
//                       <Button
//                         size="sm"
//                         variant={isOpen ? "default" : "outline"}
//                         onClick={() => handleDoorControl(device.id, !isOpen)}
//                         disabled={device.status !== 'online' || isControllingDoor}
//                       >
//                         {isControllingDoor ? (
//                           <Loader2 className="w-4 h-4 animate-spin" />
//                         ) : isOpen ? (
//                           <>
//                             <Lock className="w-4 h-4 mr-1" />
//                             Khóa
//                           </>
//                         ) : (
//                           <>
//                             <Unlock className="w-4 h-4 mr-1" />
//                             Mở
//                           </>
//                         )}
//                       </Button>
//                     </div>
//                   </div>
//                 )
//               })}
//             </div>
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   )
// }

