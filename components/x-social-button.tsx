import { Button } from "@/components/ui/button"

export function XSocialButton() {
    return (
        <div className="motion-safe:animate-fade-in-up motion-safe:animate-delay-300 mt-8">
            <div className="flex justify-center">
                <Button
                    variant="outline"
                    size="sm"
                    className="h-12 group hover:bg-transparent hover:text-foreground transition-colors bg-transparent px-6"
                    asChild
                >
                    <a
                        href="https://x.com/yswnth"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3"
                    >
                        <div className="text-left">
                            <div className="text-xs text-muted-foreground group-hover:text-foreground/80">@yswnth</div>
                        </div>
                    </a>
                </Button>
            </div>
        </div>
    )
}
