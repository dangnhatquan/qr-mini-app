import React from "react";
import { Page, Header, Box, Text, Button, Tabs, Icon } from "zmp-ui";
import { useForm } from "react-hook-form";
import { InputFormField } from "@/components/form-fields/input-field";
import { RadioFormField } from "@/components/form-fields/radio-field";
import { SelectFormField } from "@/components/form-fields/select-field";
import { QRDisplay } from "@/components/qr-display";
import { Accordion } from "@/components/accordion";
import { BottomSheet } from "@/components/bottom-sheet";
import { useState } from "react";

const UIKitPage: React.FC = () => {
  const { control } = useForm();
  const [showBottomSheet, setShowBottomSheet] = useState(false);

  return (
    <Page className="bg-slate-50 min-h-screen">
      <Header title="App UI Kit" showBackIcon />

      <Box py={4}>
        <Text.Title className="mb-6 text-slate-900 font-bold">UI Design System</Text.Title>

        <Tabs id="uikit-tabs">
          <Tabs.Tab key="typography" label="Typography">
            <Box p={4}>
              <Box className="space-y-4">
                <Box>
                  <Text size="xLarge" className="font-bold">
                    Heading xxLarge
                  </Text>
                  <Text size="small" className="text-slate-400">
                    xxLarge font-bold
                  </Text>
                </Box>
                <Box>
                  <Text size="xLarge" className="font-semibold">
                    Heading xLarge
                  </Text>
                  <Text size="small" className="text-slate-400">
                    xLarge font-semibold
                  </Text>
                </Box>
                <Box>
                  <Text size="large" className="font-medium">
                    Heading Large
                  </Text>
                  <Text size="small" className="text-slate-400">
                    large font-medium
                  </Text>
                </Box>
                <Box>
                  <Text size="normal">Body Normal text</Text>
                  <Text size="small" className="text-slate-400">
                    normal
                  </Text>
                </Box>
                <Box>
                  <Text size="small">Body Small text</Text>
                  <Text size="small" className="text-slate-400">
                    small
                  </Text>
                </Box>
                <Box>
                  <Text size="xSmall">Body xSmall text</Text>
                  <Text size="small" className="text-slate-400">
                    xSmall
                  </Text>
                </Box>
              </Box>
            </Box>
          </Tabs.Tab>

          <Tabs.Tab key="colors" label="Colors">
            <Box p={4}>
              <Text.Title
                size="small"
                className="mb-3 font-semibold text-slate-700 uppercase tracking-wider"
              >
                Brand Colors
              </Text.Title>
              <Box className="grid grid-cols-2 gap-3 mb-6">
                <ColorBox color="bg-primary" label="Primary" hex="#2563eb" />
                <ColorBox
                  color="bg-blue-100"
                  label="Primary Light"
                  hex="#dbeafe"
                  textClass="text-blue-900"
                />
              </Box>

              <Text.Title
                size="small"
                className="mb-3 font-semibold text-slate-700 uppercase tracking-wider"
              >
                Functional Colors
              </Text.Title>
              <Box className="grid grid-cols-2 gap-3 mb-6">
                <ColorBox color="bg-green-500" label="Success" hex="#22c55e" />
                <ColorBox color="bg-red-500" label="Error" hex="#ef4444" />
                <ColorBox color="bg-orange-500" label="Warning" hex="#f97316" />
                <ColorBox color="bg-blue-400" label="Info" hex="#60a5fa" />
              </Box>

              <Text.Title
                size="small"
                className="mb-3 font-semibold text-slate-700 uppercase tracking-wider"
              >
                Neutral Colors
              </Text.Title>
              <Box className="grid grid-cols-2 gap-3">
                <ColorBox color="bg-slate-900" label="Slate 900" hex="#0f172a" />
                <ColorBox color="bg-slate-600" label="Slate 600" hex="#475569" />
                <ColorBox color="bg-slate-400" label="Slate 400" hex="#94a3b8" />
                <ColorBox
                  color="bg-slate-100"
                  label="Slate 100"
                  hex="#f1f5f9"
                  textClass="text-slate-900"
                />
              </Box>
            </Box>
          </Tabs.Tab>

          <Tabs.Tab key="buttons" label="Buttons">
            <Box p={4} className="space-y-6">
              <Box>
                <Text.Title
                  size="small"
                  className="mb-3 font-semibold text-slate-700 uppercase tracking-wider"
                >
                  Standard Variants
                </Text.Title>
                <Box className="flex flex-wrap gap-3">
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button type="neutral">Neutral</Button>
                  <Button variant="secondary">Secondary Var</Button>
                  <Button variant="tertiary">Tertiary</Button>
                </Box>
              </Box>

              <Box>
                <Text.Title
                  size="small"
                  className="mb-3 font-semibold text-slate-700 uppercase tracking-wider"
                >
                  Sizes
                </Text.Title>
                <Box className="flex items-center flex-wrap gap-3">
                  <Button size="large">Large</Button>
                  <Button size="medium">Medium</Button>
                  <Button size="small">Small</Button>
                </Box>
              </Box>

              <Box>
                <Text.Title
                  size="small"
                  className="mb-3 font-semibold text-slate-700 uppercase tracking-wider"
                >
                  With Icons
                </Text.Title>
                <Box className="flex flex-wrap gap-3">
                  <Button icon={<Icon icon="zi-plus" />}>Add Item</Button>
                  <Button variant="secondary" icon={<Icon icon="zi-delete" />}>
                    Delete
                  </Button>
                  <Button type="neutral" icon={<Icon icon="zi-share" />} />
                </Box>
              </Box>

              <Box>
                <Text.Title
                  size="small"
                  className="mb-3 font-semibold text-slate-700 uppercase tracking-wider"
                >
                  Full Width
                </Text.Title>
                <Button fullWidth>Full Width Primary Button</Button>
              </Box>
            </Box>
          </Tabs.Tab>

          <Tabs.Tab key="forms" label="Forms">
            <Box p={4}>
              <Box className="p-4 bg-white shadow-sm border-0">
                <form>
                  <InputFormField
                    name="text"
                    control={control}
                    label="Text Input"
                    placeholder="Enter some text..."
                  />
                  <InputFormField
                    name="password"
                    control={control}
                    label="Password Input"
                    type="password"
                    placeholder="Enter password"
                  />
                  <SelectFormField
                    name="select"
                    control={control}
                    label="Select Field"
                    placeholder="Choose an option"
                    options={[
                      { label: "Option 1", value: "1" },
                      { label: "Option 2", value: "2" },
                      { label: "Option 3", value: "3" },
                    ]}
                  />
                  <RadioFormField
                    name="radio"
                    control={control}
                    label="Radio Selection"
                    options={[
                      { label: "Male", value: "male" },
                      { label: "Female", value: "female" },
                    ]}
                  />
                  <Button fullWidth className="mt-4">
                    Submit Form
                  </Button>
                </form>
              </Box>
            </Box>
          </Tabs.Tab>

          <Tabs.Tab key="components" label="Components">
            <Box p={4} className="space-y-8">
              <Box>
                <Text.Title
                  size="small"
                  className="mb-3 font-semibold text-slate-700 uppercase tracking-wider"
                >
                  QR Display
                </Text.Title>
                <Box className="p-6 flex flex-col items-center border-0 shadow-sm bg-white">
                  <Box className="w-32 h-32 bg-white rounded-xl shadow-inner flex items-center justify-center p-2 border border-slate-100">
                    <QRDisplay data="https://zalo.me" size={112} />
                  </Box>
                  <Text size="small" className="mt-4 text-slate-500 italic">
                    Component: QRDisplay
                  </Text>
                </Box>
              </Box>

              <Box>
                <Text.Title
                  size="small"
                  className="mb-3 font-semibold text-slate-700 uppercase tracking-wider"
                >
                  Standard Cards
                </Text.Title>
                <Box className="space-y-4">
                  <Box title="Simple Card" className="p-4 border-0 shadow-sm bg-white">
                    <Text>
                      This is a standard card component used for grouping content with a clean white
                      background.
                    </Text>
                  </Box>

                  <Box className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-white shadow-lg">
                    <Box className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
                    <Box className="relative z-10">
                      <Text size="large" className="font-bold mb-1">
                        Feature Highlight
                      </Text>
                      <Text size="small" className="opacity-80">
                        Custom styled container for highlighting premium features.
                      </Text>
                      <Box className="mt-4">
                        <Button size="small" className="bg-white text-blue-600 border-0">
                          Explore Now
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>

              <Box>
                <Text.Title
                  size="small"
                  className="mb-3 font-semibold text-slate-700 uppercase tracking-wider"
                >
                  Interactive & Misc
                </Text.Title>
                <Box className="space-y-4">
                  <Box className="p-4 border-0 shadow-sm bg-white">
                    <Text className="mb-4 font-semibold">Accordions</Text>
                    <Accordion title="How to use QR codes?">
                      <Text size="small">
                        Simply point your camera at the QR code to scan it. Our app makes it easy to
                        generate and manage them.
                      </Text>
                    </Accordion>
                    <Accordion title="Is it free?">
                      <Text size="small">
                        Yes, basic QR generation is completely free for all users.
                      </Text>
                    </Accordion>
                  </Box>

                  <Box className="p-4 border-0 shadow-sm bg-white">
                    <Text className="mb-4 font-semibold">Bottom Sheet</Text>
                    <Button
                      fullWidth
                      variant="secondary"
                      onClick={() => setShowBottomSheet(!showBottomSheet)}
                    >
                      {showBottomSheet ? "Close" : "Open"} Bottom Sheet
                    </Button>
                    {showBottomSheet && (
                      <BottomSheet
                        content={
                          <Box className="p-4">
                            <Text>This is the content of the bottom sheet</Text>
                          </Box>
                        }
                      />
                    )}
                  </Box>
                </Box>
              </Box>

              <Box>
                <Text.Title
                  size="small"
                  className="mb-3 font-semibold text-slate-700 uppercase tracking-wider"
                >
                  Premium QR Cards
                </Text.Title>
                <Box className="space-y-4">
                  <div className="rounded-2xl shadow-xl p-6 w-full bg-gradient-to-br from-indigo-500 to-purple-700 text-white relative overflow-hidden">
                    <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10 blur-xl" />
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <Text className="font-extrabold text-xl uppercase tracking-tighter mb-2 leading-1">
                          VCB
                        </Text>
                        <div className="flex gap-2">
                          <span className="text-[8px] px-2 py-1 rounded-full bg-white/20 border border-white/30 uppercase font-bold">
                            Banking
                          </span>
                        </div>
                      </div>
                      <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center p-1">
                        <QRDisplay data="MBBANK_PAYMENT_DATA" size={60} />
                      </div>
                    </div>
                    <div className="mt-8 flex justify-between items-end">
                      <div>
                        <Text className="text-white/60 text-[8px] font-bold uppercase tracking-wider">
                          Owner
                        </Text>
                        <Text className="font-bold text-sm">NGUYEN VAN A</Text>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                        <Icon icon="zi-more-horiz" size={18} />
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl shadow-xl p-6 w-full bg-gradient-to-br from-green-500 to-teal-600 text-white relative overflow-hidden">
                    <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10 blur-xl" />
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <Text className="font-extrabold text-xl uppercase tracking-tighter mb-2 leading-1">
                          Home Wifi
                        </Text>
                        <div className="flex gap-2">
                          <span className="text-[8px] px-2 py-1 rounded-full bg-white/20 border border-white/30 uppercase font-bold">
                            Wifi
                          </span>
                        </div>
                      </div>
                      <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center p-1">
                        <QRDisplay data="WIFI_DATA" size={60} />
                      </div>
                    </div>
                    <div className="mt-8 flex justify-between items-end">
                      <div>
                        <Text className="text-white/60 text-[8px] font-bold uppercase tracking-wider">
                          SSID
                        </Text>
                        <Text className="font-bold text-sm">My Awesome Network</Text>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                        <Icon icon="zi-more-horiz" size={18} />
                      </div>
                    </div>
                  </div>
                </Box>
              </Box>
            </Box>
          </Tabs.Tab>
        </Tabs>
      </Box>
    </Page>
  );
};

const ColorBox: React.FC<{ color: string; label: string; hex: string; textClass?: string }> = ({
  color,
  label,
  hex,
  textClass = "text-white",
}) => (
  <Box
    className={`${color} rounded-xl p-4 flex flex-col justify-between aspect-video shadow-sm border border-slate-100`}
  >
    <Text size="small" className={`${textClass} font-bold`}>
      {label}
    </Text>
    <Text size="xSmall" className={`${textClass} opacity-80 font-mono uppercase`}>
      {hex}
    </Text>
  </Box>
);

export default UIKitPage;
