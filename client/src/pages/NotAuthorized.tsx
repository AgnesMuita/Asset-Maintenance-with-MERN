import React from 'react'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { SirenIcon } from 'lucide-react'


const NotAuthorized: React.FunctionComponent = () => {
    return (
        <div className='border-l w-full'>
            <Card className='max-h-[10rem] w-2/3 mt-[5rem] mx-auto'>
                <CardHeader>
                    <CardTitle className='flex items-center gap-x-2 text-red-500'>
                        <SirenIcon />
                        <p className='text-2xl'>Need Authorization</p>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className='text-2xl font-me'>You are not authorized to access this page. Contact your administrator for further assistance.</p>
                </CardContent>
            </Card>
        </div>

    )
}

export default NotAuthorized